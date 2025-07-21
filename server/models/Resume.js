import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  analysisStatus: {
    type: String,
    enum: ['Pending', 'Processed', 'Failed'],
    default: 'Pending',
  },
  latestScore: {
    type: Number,
  },
  feedbackSummary: {
    type: String,
  },
  evaluationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EvaluationResult',
  }],
});

export default mongoose.model('Resume', ResumeSchema);