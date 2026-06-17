import { Matter } from '../models/Matter.js';
import { TrackedCase } from '../models/TrackedCase.js';
import { generatePDF, generateDOCX } from '../services/document.service.js';
import { draftLegalDocument } from '../services/llm.service.js';

const DOC_TITLES = {
  fir: 'First Information Report (Draft)',
  consumer: 'Consumer Complaint Letter',
  notice: 'Legal Notice',
  rti: 'RTI Application',
  demand: 'Demand Notice (Wages)',
};

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
    const { title, description = '', category = 'other' } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const matter = await Matter.create({ userId: req.user.sub, title, description, category });
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
    const { title, description, status, notes, tags } = req.body;
    const updates = {};
    if (title       !== undefined) updates.title       = title;
    if (description !== undefined) updates.description = description;
    if (status      !== undefined) updates.status      = status;
    if (notes       !== undefined) updates.notes       = notes;
    if (tags        !== undefined) updates.tags        = tags;

    const matter = await Matter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      updates,
      { new: true }
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
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
    const matter = await Matter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { $addToSet: { sessions: sessionId } },
      { new: true }
    );
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json({ matter });
  } catch (err) {
    next(err);
  }
}

export async function linkCase(req, res, next) {
  try {
    const { cnrNumber } = req.body;
    if (!cnrNumber) return res.status(400).json({ error: 'cnrNumber is required' });

    // Find or auto-create a TrackedCase for this user
    let trackedCase = await TrackedCase.findOne({
      userId: req.user.sub,
      cnrNumber: cnrNumber.toUpperCase(),
    });
    if (!trackedCase) {
      trackedCase = await TrackedCase.create({
        userId: req.user.sub,
        cnrNumber: cnrNumber.toUpperCase(),
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
    const { query, docType, format = 'pdf', formData } = req.body;
    if (!docType) return res.status(400).json({ error: 'docType is required' });

    const matter = await Matter.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!matter) return res.status(404).json({ error: 'Matter not found' });

    // Generate the document
    const title = DOC_TITLES[docType] || docType;
    const queryStr = query || Object.values(formData || {}).filter(Boolean).join('. ');
    const body = await draftLegalDocument(queryStr, docType);
    const buffer = format === 'docx' ? await generateDOCX(title, body) : await generatePDF(title, body);

    // Store the record so it can be regenerated later
    const filename = `${docType}_${Date.now()}.${format}`;
    matter.documents.push({ filename, docType, format, query: query || '', formData, generatedAt: new Date() });
    await matter.save();

    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.set('Content-Type', format === 'pdf' ? 'application/pdf'
                           : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
