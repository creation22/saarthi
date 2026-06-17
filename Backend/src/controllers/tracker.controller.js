import { TrackedCase } from '../models/TrackedCase.js';
import { fetchCaseByCNR, validateCNR } from '../services/ecourts.service.js';

export async function addTrackedCase(req, res, next) {
  try {
    const { cnrNumber } = req.body;
    if (!cnrNumber) return res.status(400).json({ error: 'cnrNumber is required' });

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

    const trackedCase = await TrackedCase.create({
      userId: req.user.sub,
      ...caseData,
      lastFetched: new Date(),
      fetchError,
    });

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
      // Merge new hearings without duplicating existing ones
      const newHearings = data.hearings.filter(h =>
        !trackedCase.hearings.some(e => e.date?.getTime() === h.date?.getTime())
      );
      await trackedCase.updateOne({
        ...data,
        hearings: [...trackedCase.hearings, ...newHearings],
        lastFetched: new Date(),
        fetchError: null,
      });
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
