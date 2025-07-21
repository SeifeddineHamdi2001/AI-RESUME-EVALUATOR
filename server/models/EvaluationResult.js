import mongoose from 'mongoose';

const EvaluationResultSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jobOfferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  score: {
    type: Number,
  },
  skillsMatch: {
    type: Number,
  },
  experience: {
    type: Number,
  },
  readability: {
    type: Number,
  },
  matchedSkills: [{
    type: String,
  }],
  missingSkills: [{
    type: String,
  }],
  suggestions: [{
    type: String,
  }],
  evaluatedAt: {
    type: Date,
    default: Date.now,
  },
  modelVesion: {
    type: String,
  },
});

export default mongoose.model('EvaluationResult', EvaluationResultSchema, 'evaluationresults');