import { Matter } from '../models/Matter.js';
import { TrackedCase } from '../models/TrackedCase.js';
import { generatePDF, generateDOCX } from '../services/document.service.js';
import { draftLegalDocument } from '../services/llm.service.js';
import { validateCNR } from '../services/ecourts.service.js';

const DOC_TITLES = {
  fir: 'First Information Report (Draft)',
  consumer: 'Consumer Complaint Letter',
  notice: 'Legal Notice',
  rti: 'RTI Application',
  demand: 'Demand Notice (Wages)',
};

const VALID_DOC_TYPES = new Set(Object.keys(DOC_TITLES));
const VALID_FORMATS = new Set(['pdf', 'docx']);
const VALID_STATUS = new Set(['open', 'resolved', 'archived']);
const MAX_QUERY_CHARS = 6000;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// Content-Disposition filenames must be inert: fixed charset, no CRLF/quotes
function safeDownloadFilename(docType, format) {
  const cleanType = VALID_DOC_TYPES.has(docType) ? docType : 'document';
  const cleanFormat = VALID_FORMATS.has(format) ? format : 'pdf';
  return `${cleanType}_${Date.now()}.${cleanFormat}`;
}

export async function listMatters(req, res, next) {
  try {
    const matters = await Matter.find({ userId: req.user.sub })
      .select('-documents.formData')
      .sort({ updatedAt: -1 });
    res.json({ matters });
  } catch (err) {
    next(err);
  }
}

export async function createMatter(req, res, next) {
  try {
    const { title, description = '', category = 'other' } = req.body ?? {};
    if (!isNonEmptyString(title)) return res.status(400).json({ error: 'title is required' });
    if (title.trim().length > 200) return res.status(400).json({ error: 'title must be 200 characters or fewer' });
    if (typeof description === 'string' && description.length > 5000) {
      return res.status(400).json({ error: 'description must be 5000 characters or fewer' });
    }
    const matter = await Matter.create({
      userId: req.user.sub,
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      category,
    });
    res.status(201).json({ matter });
  } catch (err) {
    next(err);
  }
}

export async function getMatter(req, res, next) {
  try {
    const matter = await Matter.findOne({ _id: req.params.id, userId: req.user.sub })
      .populate('trackedCases');
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json({ matter });
  } catch (err) {
    next(err);
  }
}

export async function updateMatter(req, res, next) {
  try {
    const { title, description, status, notes, tags } = req.body ?? {};
    const updates = {};
    if (title !== undefined) {
      if (!isNonEmptyString(title) || title.trim().length > 200) {
        return res.status(400).json({ error: 'title must be 1–200 characters' });
      }
      updates.title = title.trim();
    }
    if (description !== undefined) {
      if (typeof description !== 'string' || description.length > 5000) {
        return res.status(400).json({ error: 'description must be a string of 5000 characters or fewer' });
      }
      updates.description = description;
    }
    if (status !== undefined) {
      if (!VALID_STATUS.has(status)) {
        return res.status(400).json({ error: 'status must be one of: open, resolved, archived' });
      }
      updates.status = status;
    }
    if (notes !== undefined) {
      if (typeof notes !== 'string' || notes.length > 20000) {
        return res.status(400).json({ error: 'notes must be a string of 20000 characters or fewer' });
      }
      updates.notes = notes;
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags) || tags.length > 30 || tags.some((t) => typeof t !== 'string' || !t.trim() || t.length > 50)) {
        return res.status(400).json({ error: 'tags must be an array of up to 30 strings (50 chars each)' });
      }
      updates.tags = tags.map((t) => t.trim());
    }

    const matter = await Matter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      updates,
      { new: true, runValidators: true }
    );
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json({ matter });
  } catch (err) {
    next(err);
  }
}

export async function deleteMatter(req, res, next) {
  try {
    const result = await Matter.findOneAndDelete({ _id: req.params.id, userId: req.user.sub });
    if (!result) return res.status(404).json({ error: 'Matter not found' });
    res.json({ message: 'Matter deleted' });
  } catch (err) {
    next(err);
  }
}

export async function linkSession(req, res, next) {
  try {
    const { sessionId } = req.body ?? {};
    if (!isNonEmptyString(sessionId) || sessionId.trim().length > 128) {
      return res.status(400).json({ error: 'sessionId is required' });
    }
    const matter = await Matter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { $addToSet: { sessions: sessionId.trim() } },
      { new: true, runValidators: true }
    );
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json({ matter });
  } catch (err) {
    next(err);
  }
}

export async function linkCase(req, res, next) {
  try {
    const { cnrNumber } = req.body ?? {};
    if (!isNonEmptyString(cnrNumber)) return res.status(400).json({ error: 'cnrNumber is required' });

    const cnr = cnrNumber.trim().toUpperCase();
    if (!validateCNR(cnr)) {
      return res.status(400).json({ error: 'Invalid CNR format. Expected 4 letters + 12 digits (e.g. MHPU010012342024)' });
    }

    // Find or auto-create a TrackedCase for this user
    let trackedCase = await TrackedCase.findOne({
      userId: req.user.sub,
      cnrNumber: cnr,
    });
    if (!trackedCase) {
      trackedCase = await TrackedCase.create({
        userId: req.user.sub,
        cnrNumber: cnr,
        fetchError: 'Not yet fetched — click Refresh on the Case Tracker page.',
      });
    }

    const matter = await Matter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { $addToSet: { trackedCases: trackedCase._id } },
      { new: true }
    );
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json({ matter, trackedCase });
  } catch (err) {
    next(err);
  }
}

export async function generateMatterDocument(req, res, next) {
  try {
    const { query, docType, format = 'pdf', formData } = req.body ?? {};
    if (typeof docType !== 'string' || !VALID_DOC_TYPES.has(docType)) {
      return res.status(400).json({ error: 'docType must be one of: fir, consumer, notice, rti, demand' });
    }
    if (typeof format !== 'string' || !VALID_FORMATS.has(format)) {
      return res.status(400).json({ error: "format must be 'pdf' or 'docx'" });
    }

    const matter = await Matter.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!matter) return res.status(404).json({ error: 'Matter not found' });

    // Generate the document
    const title = DOC_TITLES[docType];
    let queryStr = isNonEmptyString(query) ? query.trim() : '';
    if (!queryStr && formData && typeof formData === 'object') {
      queryStr = Object.values(formData).filter((v) => v !== undefined && v !== null && v !== '' && v !== false).map(String).join('. ');
    }
    queryStr = queryStr.slice(0, MAX_QUERY_CHARS);
    if (!queryStr) return res.status(400).json({ error: 'query or formData is required to draft the document' });

    const body = await draftLegalDocument(queryStr, docType);
    const buffer = format === 'docx' ? await generateDOCX(title, body) : await generatePDF(title, body);

    // Store the record so it can be regenerated later (cap formData size)
    const filename = safeDownloadFilename(docType, format);
    let storedFormData = formData;
    try {
      if (storedFormData && JSON.stringify(storedFormData).length > 20000) storedFormData = undefined;
    } catch {
      storedFormData = undefined;
    }
    matter.documents.push({ filename, docType, format, query: isNonEmptyString(query) ? query.trim().slice(0, MAX_QUERY_CHARS) : '', formData: storedFormData, generatedAt: new Date() });
    await matter.save();

    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.set('Content-Type', format === 'pdf' ? 'application/pdf'
                           : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
