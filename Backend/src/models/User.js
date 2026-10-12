import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true, maxlength: 120 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // Clerk user id (user_…). Set on first sign-in; absent on accounts that predate Clerk.
    clerkId:      { type: String, unique: true, sparse: true },
    // Only present on accounts registered with a local password
    passwordHash: { type: String },
    phone:        { type: String, default: '', maxlength: 30 },
    // slots for future password-reset flow — no migration needed later
    passwordResetToken:  { type: String, default: null },
    passwordResetExpiry: { type: Date,   default: null },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

export const User = mongoose.model('User', userSchema);
