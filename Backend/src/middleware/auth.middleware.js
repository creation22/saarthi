import jwt from 'jsonwebtoken';

function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}

/** Reject the request if no valid Bearer token is present. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
}

/** Attach user to req if a valid token is present; pass through otherwise.
 *  Used on query routes so anonymous users still work. */
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    const token = header.slice(7).trim();
    if (token) {
      try {
        req.user = verifyToken(token);
      } catch {
        /* invalid token — treat as anonymous */
      }
    }
  }
  next();
}
