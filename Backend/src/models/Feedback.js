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

export const Feedback = mongoose.model('Feedback', feedbackSchema);
