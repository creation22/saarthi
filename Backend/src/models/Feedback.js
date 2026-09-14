import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    sessionId:    { type: String, required: true, index: true },
    messageIndex: { type: Number, required: true },  // index of the assistant message in session
    guidance:     { type: String },                   // snapshot of the answer rated
    rating:       { type: String, enum: ['up', 'down'], required: true },
    comment:      { type: String, default: '' },
  },
  { timestamps: true }
);

// Enforce "one rating per session+message" at the DB level (the controller
// upserts on this key, so concurrent votes can't create duplicates)
feedbackSchema.index({ sessionId: 1, messageIndex: 1 }, { unique: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
