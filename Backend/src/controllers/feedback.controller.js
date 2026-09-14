import { Feedback } from '../models/Feedback.js';

const VALID_RATINGS = new Set(['up', 'down']);

export async function submitFeedback(req, res, next) {
  try {
    const { sessionId, messageIndex, guidance, rating, comment } = req.body ?? {};
    if (typeof sessionId !== 'string' || !sessionId.trim() || !VALID_RATINGS.has(rating)) {
      return res.status(400).json({ error: 'sessionId and a valid rating (up/down) are required' });
    }
    if (messageIndex !== undefined && (!Number.isInteger(messageIndex) || messageIndex < 0 || messageIndex > 10000)) {
      return res.status(400).json({ error: 'messageIndex must be a non-negative integer' });
    }
    if (guidance !== undefined && (typeof guidance !== 'string' || guidance.length > 30000)) {
      return res.status(400).json({ error: 'guidance must be a string of 30000 characters or fewer' });
    }
    if (comment !== undefined && (typeof comment !== 'string' || comment.length > 2000)) {
      return res.status(400).json({ error: 'comment must be a string of 2000 characters or fewer' });
    }

    // Upsert — one rating per session+message
    await Feedback.findOneAndUpdate(
      { sessionId: sessionId.trim(), messageIndex },
      { sessionId: sessionId.trim(), messageIndex, guidance, rating, comment },
      { upsert: true, new: true }
    );

    res.json({ message: 'Feedback recorded' });
  } catch (err) {
    next(err);
  }
}
