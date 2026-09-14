import { TrackedCase } from '../models/TrackedCase.js';
import { fetchCaseByCNR, validateCNR } from '../services/ecourts.service.js';

export async function addTrackedCase(req, res, next) {
  try {
    const { cnrNumber } = req.body ?? {};
    if (typeof cnrNumber !== 'string' || !cnrNumber.trim()) {
      return res.status(400).json({ error: 'cnrNumber is required' });
    }

    const cnr = cnrNumber.trim().toUpperCase();
    if (!validateCNR(cnr)) {
      return res.status(400).json({ error: 'Invalid CNR format. Expected 4 letters + 12 digits (e.g. MHPU010012342024)' });
    }

    // Check for duplicate
    const existing = await TrackedCase.findOne({ userId: req.user.sub, cnrNumber: cnr });
    if (existing) return res.status(409).json({ error: 'You are already tracking this case', case: existing });

    // Attempt to fetch from eCourts
    let caseData = { cnrNumber: cnr };
    let fetchError = null;
    try {
      caseData = await fetchCaseByCNR(cnr);
    } catch (err) {
      fetchError = err.message;
    }

    let trackedCase;
    try {
      trackedCase = await TrackedCase.create({
        userId: req.user.sub,
        ...caseData,
        lastFetched: new Date(),
        fetchError,
      });
    } catch (err) {
      // Lost a concurrent-insert race — return the winner as 409
      if (err?.code === 11000) {
        const winner = await TrackedCase.findOne({ userId: req.user.sub, cnrNumber: cnr });
        return res.status(409).json({ error: 'You are already tracking this case', case: winner });
      }
      throw err;
    }

    res.status(201).json({ case: trackedCase });
  } catch (err) {
    next(err);
  }
}

export async function getTrackedCases(req, res, next) {
  try {
    const cases = await TrackedCase.find({ userId: req.user.sub })
      .sort({ updatedAt: -1 });
    res.json({ cases });
  } catch (err) {
    next(err);
  }
}

export async function getCaseDetail(req, res, next) {
  try {
    const trackedCase = await TrackedCase.findOne({
      userId: req.user.sub,
      cnrNumber: req.params.cnr.toUpperCase(),
    });
    if (!trackedCase) return res.status(404).json({ error: 'Case not found' });
    res.json({ case: trackedCase });
  } catch (err) {
    next(err);
  }
}

export async function refreshCase(req, res, next) {
  try {
    const trackedCase = await TrackedCase.findOne({
      userId: req.user.sub,
      cnrNumber: req.params.cnr.toUpperCase(),
    });
    if (!trackedCase) return res.status(404).json({ error: 'Case not found' });

    let fetchError = null;
    try {
      const data = await fetchCaseByCNR(trackedCase.cnrNumber);
      // Merge new hearings without duplicating existing ones.
      // Identity = date (when present) + purpose, so dateless rows can't
      // collapse into each other via undefined === undefined.
      const hearingKey = (h) => {
        const t = h?.date instanceof Date ? h.date.getTime()
          : h?.date ? new Date(h.date).getTime() : 'nodate';
        return `${Number.isNaN(t) ? 'nodate' : t}|${(h?.purpose || '').trim().slice(0, 80)}`;
      };
      const existingKeys = new Set((trackedCase.hearings || []).map(hearingKey));
      const newHearings = (data.hearings || []).filter((h) => !existingKeys.has(hearingKey(h)));
      // Only overwrite fields the fresh fetch actually populated, so a thin
      // parse can't wipe previously stored values with '' / null.
      const merged = { lastFetched: new Date(), fetchError: null };
      for (const [k, v] of Object.entries(data)) {
        if (k === 'hearings' || k === 'cnrNumber') continue;
        if (v === '' || v === null || v === undefined) continue;
        if (k === 'parties' && !v?.petitioner && !v?.respondent) continue;
        merged[k] = v;
      }
      merged.hearings = [...(trackedCase.hearings || []), ...newHearings];
      await trackedCase.updateOne(merged);
    } catch (err) {
      fetchError = err.message;
      await trackedCase.updateOne({ lastFetched: new Date(), fetchError });
    }

    const updated = await TrackedCase.findById(trackedCase._id);
    res.json({ case: updated, fetchError });
  } catch (err) {
    next(err);
  }
}

export async function untrackCase(req, res, next) {
  try {
    const result = await TrackedCase.findOneAndDelete({
      userId: req.user.sub,
      cnrNumber: req.params.cnr.toUpperCase(),
    });
    if (!result) return res.status(404).json({ error: 'Case not found' });
    res.json({ message: 'Case removed from tracking' });
  } catch (err) {
    next(err);
  }
}
