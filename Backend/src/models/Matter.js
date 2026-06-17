import mongoose from 'mongoose';

const documentRecordSchema = new mongoose.Schema(
  {
    filename:    { type: String },
    docType:     { type: String },   // 'fir' | 'consumer' | 'notice' | 'rti' | 'demand'
    format:      { type: String },   // 'pdf' | 'docx'
    query:       { type: String },   // stored so the doc can be regenerated on demand
    formData:    { type: mongoose.Schema.Types.Mixed },
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const matterSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category:    {
      type: String,
      enum: ['tenant', 'consumer', 'workplace', 'family', 'criminal',
             'property', 'rti', 'contract', 'other'],
      default: 'other',
    },
    status:      { type: String, enum: ['open', 'resolved', 'archived'], default: 'open' },
    sessions:    [{ type: String }],   // sessionIds
    trackedCases:[{ type: mongoose.Schema.Types.ObjectId, ref: 'TrackedCase' }],
    documents:   [documentRecordSchema],
    notes:       { type: String, default: '' },
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

export const Matter = mongoose.model('Matter', matterSchema);
