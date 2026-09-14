import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD_LENGTH = 128;

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    const err = new Error('Authentication is not configured');
    err.status = 500;
    throw err;
  }
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function safeUser(user) {
  return { _id: user._id, name: user.name, email: user.email, phone: user.phone };
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export async function registerController(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {};
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = normalizeEmail(email);
    if (!cleanName || !cleanEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    if (cleanName.length > 120) {
      return res.status(400).json({ error: 'Name must be 120 characters or fewer' });
    }
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer` });
    }
    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name: cleanName, email: cleanEmail, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken(user);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function getMeController(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash -passwordResetToken -passwordResetExpiry');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateMeController(req, res, next) {
  try {
    const { name, phone } = req.body ?? {};
    const updates = {};
    if (name !== undefined) {
      const cleanName = typeof name === 'string' ? name.trim() : '';
      if (!cleanName || cleanName.length > 120) {
        return res.status(400).json({ error: 'Name must be 1–120 characters' });
      }
      updates.name = cleanName;
    }
    if (phone !== undefined) {
      const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
      if (cleanPhone.length > 30) {
        return res.status(400).json({ error: 'Phone number is too long' });
      }
      updates.phone = cleanPhone;
    }
    const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true, runValidators: true })
      .select('-passwordHash -passwordResetToken -passwordResetExpiry');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
