import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function safeUser(user) {
  return { _id: user._id, name: user.name, email: user.email, phone: user.phone };
}

export async function registerController(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const user = await User.findOne({ email });
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
    const { name, phone } = req.body;
    const updates = {};
    if (name)  updates.name  = name.trim();
    if (phone) updates.phone = phone.trim();
    const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true })
      .select('-passwordHash -passwordResetToken -passwordResetExpiry');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
