import mongoose from 'mongoose';

const hearingSchema = new mongoose.Schema(
  {
    date:        { type: Date },
    purpose:     { type: String },   // e.g. "Arguments", "Judgment"
    nextDate:    { type: Date },
    judge:       { type: String },
    courtNumber: { type: String },
    orderUrl:    { type: String },
  },
  { _id: false }
);

const trackedCaseSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cnrNumber: { type: String, required: true, uppercase: true, trim: true },
    caseTitle: { type: String, default: '' },
    caseType:  { type: String, default: '' },
    filingDate:{ type: Date },
    courtName: { type: String, default: '' },
    stage:     { type: String, default: '' },
    status:    { type: String, enum: ['pending', 'disposed', 'unknown'], default: 'unknown' },
    parties:   {
      petitioner:  { type: String, default: '' },
      respondent:  { type: String, default: '' },
    },
    hearings:     [hearingSchema],
    lastFetched:  { type: Date, default: Date.now },
    fetchError:   { type: String, default: null },
    matterId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Matter', default: null },
  },
  { timestamps: true }
);

// One user cannot track the same CNR twice
trackedCaseSchema.index({ userId: 1, cnrNumber: 1 }, { unique: true });

export const TrackedCase = mongoose.model('TrackedCase', trackedCaseSchema);
