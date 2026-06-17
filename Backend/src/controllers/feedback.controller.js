import { Feedback } from '../models/Feedback.js';

export async function submitFeedback(req, res, next) {
  try {
    const { sessionId, messageIndex, guidance, rating, comment } = req.body;
    if (!sessionId || !rating) {
      return res.status(400).json({ error: 'sessionId and rating are required' });
    }

    // Upsert — one rating per session+message
    await Feedback.findOneAndUpdate(
      { sessionId, messageIndex },
      { sessionId, messageIndex, guidance, rating, comment },
      { upsert: true, new: true }
    );

    res.json({ message: 'Feedback recorded' });
  } catch (err) {
    next(err);
  }
}
