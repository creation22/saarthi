import { Session } from '../models/Session.js';

export async function getSession(req, res, next) {
  try {
    const session = await Session.findOne({ sessionId: req.params.id });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req, res, next) {
  try {
    const result = await Session.deleteOne({ sessionId: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    next(err);
  }
}
