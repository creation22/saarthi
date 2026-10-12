import { createClerkClient, verifyToken } from '@clerk/backend';
import { User } from '../models/User.js';

let clerkClient;
function clerk() {
  clerkClient ??= createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  return clerkClient;
}

function bearerToken(req) {
  const header = req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return '';
  return header.slice(7).trim();
}

/** Clerk session JWT → its claims, or null if it doesn't verify. */
async function verifySession(token) {
  try {
    return await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
  } catch (err) {
    // Logged because a wrong/missing CLERK_SECRET_KEY looks identical to a bad token from the client
    console.warn('Clerk token rejected:', err.reason || err.message);
    return null;
  }
}

/** First request from a Clerk account: adopt the local user with the same
 *  verified email (accounts created before Clerk), or create one. */
async function provisionUser(clerkId) {
  const clerkUser = await clerk().users.getUser(clerkId);
  const primary = clerkUser.primaryEmailAddress;
  if (primary?.verification?.status !== 'verified') {
    const err = new Error('Verify your email address to continue');
    err.status = 403;
    throw err;
  }
  const email = primary.emailAddress.toLowerCase();
  const name = (clerkUser.fullName || email.split('@')[0]).slice(0, 120);
  return User.findOneAndUpdate(
    { email },
    { $set: { clerkId }, $setOnInsert: { name } },
    { upsert: true, returnDocument: 'after' }
  );
}

/** Matters, tracked cases and sessions reference User._id, so controllers keep
 *  reading req.user.sub as a Mongo id rather than the Clerk user id. */
async function resolveUser(clerkId) {
  const user = (await User.findOne({ clerkId }).select('_id email')) ?? (await provisionUser(clerkId));
  return { sub: user._id.toString(), email: user.email };
}

/** Reject the request if no valid Bearer token is present. */
export async function requireAuth(req, res, next) {
  const token = bearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const claims = await verifySession(token);
  if (!claims) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
  try {
    req.user = await resolveUser(claims.sub);
    next();
  } catch (err) {
    next(err);
  }
}

/** Attach user to req if a valid token is present; pass through otherwise.
 *  Used on query routes so anonymous users still work. */
export async function optionalAuth(req, _res, next) {
  const token = bearerToken(req);
  if (token) {
    try {
      const claims = await verifySession(token);
      if (claims) req.user = await resolveUser(claims.sub);
    } catch (err) {
      /* account lookup failed — treat as anonymous */
      console.error('optionalAuth:', err.message);
    }
  }
  next();
}
