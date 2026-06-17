import axios from 'axios';
import * as cheerio from 'cheerio';
import { TrackedCase } from '../models/TrackedCase.js';

const CNR_REGEX = /^[A-Z]{4}\d{12}$/;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

/** Validate CNR format: 4 alpha + 12 digits, e.g. MHPU010012342024 */
export function validateCNR(cnr) {
  return CNR_REGEX.test(cnr?.trim().toUpperCase());
}

/**
 * Attempt to fetch case data from eCourts.
 * Returns a normalized object on success; throws on failure.
 */
export async function fetchCaseByCNR(cnrNumber) {
  const cnr = cnrNumber.trim().toUpperCase();
  if (!validateCNR(cnr)) {
    const err = new Error('Invalid CNR number format. Expected 4 letters + 12 digits (e.g. MHPU010012342024)');
    err.status = 400;
    throw err;
  }

  // Try hcservices endpoint (High Court cases)
  try {
    const { data: html } = await axios.get(
      `https://hcservices.ecourts.gov.in/hcservices/cases_qry.php`,
      { params: { cnr_no: cnr }, headers: HEADERS, timeout: 15000 }
    );
    const parsed = parseECourtsHTML(html, cnr);
    if (parsed) return parsed;
  } catch {
    /* fall through to district courts */
  }

  // Try district courts endpoint
  try {
    const { data: html } = await axios.get(
      `https://services.ecourts.gov.in/ecourtindia_v6/cases/case_no.php`,
      { params: { cnr_no: cnr }, headers: HEADERS, timeout: 15000 }
    );
    const parsed = parseECourtsHTML(html, cnr);
    if (parsed) return parsed;
  } catch {
    /* fall through */
  }

  // Both endpoints failed — throw so the controller can save fetchError
  const err = new Error(
    'Could not retrieve case data from eCourts. The portal may be temporarily unavailable. ' +
    'Your case has been saved — click Refresh to try again later.'
  );
  err.status = 503;
  throw err;
}

/** Parse eCourts HTML response into a normalized object. Returns null if unparseable. */
function parseECourtsHTML(html, cnr) {
  if (!html || typeof html !== 'string') return null;

  const $ = cheerio.load(html);

  // Check for "case not found" signals
  const body = $('body').text().toLowerCase();
  if (body.includes('no record') || body.includes('case not found') || body.includes('invalid cnr')) {
    const err = new Error(`No case found for CNR ${cnr}. Please verify the number.`);
    err.status = 404;
    throw err;
  }

  // Extract case details — eCourts uses a table-based layout
  const result = {
    cnrNumber:  cnr,
    caseTitle:  '',
    caseType:   '',
    courtName:  '',
    stage:      '',
    status:     'unknown',
    parties:    { petitioner: '', respondent: '' },
    filingDate: null,
    hearings:   [],
  };

  // Case title / parties
  const titleEl = $('table td:contains("Petitioner")').parent().next().find('td').first();
  if (titleEl.length) result.parties.petitioner = titleEl.text().trim();

  const respondentEl = $('table td:contains("Respondent")').parent().next().find('td').first();
  if (respondentEl.length) result.parties.respondent = respondentEl.text().trim();

  // Case type
  const caseTypeEl = $('table td:contains("Case Type")').next();
  if (caseTypeEl.length) result.caseType = caseTypeEl.text().trim();

  // Court name
  const courtEl = $('table td:contains("Court Name")').next();
  if (courtEl.length) result.courtName = courtEl.text().trim();

  // Status / stage
  const stageEl = $('table td:contains("Stage")').next();
  if (stageEl.length) result.stage = stageEl.text().trim();

  const statusEl = $('table td:contains("Status")').next();
  if (statusEl.length) {
    const statusText = statusEl.text().trim().toLowerCase();
    result.status = statusText.includes('dispos') ? 'disposed'
                  : statusText.includes('pending') ? 'pending'
                  : 'unknown';
  }

  // Filing date
  const filingEl = $('table td:contains("Date of Filing")').next();
  if (filingEl.length) {
    const d = new Date(filingEl.text().trim());
    if (!isNaN(d)) result.filingDate = d;
  }

  // Hearing history rows
  $('table').each((_, table) => {
    const headers = $(table).find('th').map((_, th) => $(th).text().trim().toLowerCase()).get();
    if (headers.some(h => h.includes('hearing') || h.includes('next date'))) {
      $(table).find('tr').slice(1).each((_, row) => {
        const cells = $(row).find('td').map((_, td) => $(td).text().trim()).get();
        if (cells.length >= 2) {
          const hearing = {};
          const d = new Date(cells[0]);
          if (!isNaN(d)) hearing.date = d;
          hearing.purpose = cells[1] || '';
          if (cells[2]) {
            const nd = new Date(cells[2]);
            if (!isNaN(nd)) hearing.nextDate = nd;
          }
          hearing.judge       = cells[3] || '';
          hearing.courtNumber = cells[4] || '';
          if (hearing.date || hearing.purpose) result.hearings.push(hearing);
        }
      });
    }
  });

  // Build a case title from parties if none found
  if (!result.caseTitle && (result.parties.petitioner || result.parties.respondent)) {
    result.caseTitle = [result.parties.petitioner, result.parties.respondent]
      .filter(Boolean).join(' vs ');
  }

  return result;
}

/**
 * Refresh all TrackedCase records last fetched more than `staleHours` hours ago.
 * Called on a background interval from index.js.
 */
export async function refreshStaleCases(staleHours = 6) {
  const cutoff = new Date(Date.now() - staleHours * 60 * 60 * 1000);
  const stale  = await TrackedCase.find({ lastFetched: { $lt: cutoff } }).limit(50);

  for (const c of stale) {
    try {
      const data = await fetchCaseByCNR(c.cnrNumber);
      await TrackedCase.findByIdAndUpdate(c._id, {
        ...data,
        lastFetched: new Date(),
        fetchError:  null,
        $push: { hearings: { $each: data.hearings.filter(h =>
          !c.hearings.some(existing => existing.date?.getTime() === h.date?.getTime())
        ) } },
      });
    } catch (err) {
      await TrackedCase.findByIdAndUpdate(c._id, {
        lastFetched: new Date(),
        fetchError:  err.message,
      });
    }
  }
}
