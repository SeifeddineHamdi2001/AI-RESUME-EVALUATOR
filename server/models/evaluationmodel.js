import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    score: {
      type: Number,
      required: true
    },
    skillsMatch: {
      type: Number,
      required: true
    },
    missingSkills: {
      type: [String],
      default: []
    },
    experienceMatch: {
      type: Number,
      required: true
    },
    experienceGap: {
      type: Number,
      default: 0
    },
    educationMatch: {
      type: Number,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    suggestions: {
      type: String,
      required: true
    },
    recommendation: {
      type: String,
      enum: ['Strong Fit', 'Moderate Fit', 'Weak Fit'],
      required: true
    },
    isReviewed: {
      type: Boolean,
      default: false
    },
    isSubmitted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index to ensure a user doesn't evaluate the same resume for the same job multiple times
evaluationSchema.index({ resumeId: 1, jobId: 1, userId: 1, applicationId: 1 }, { unique: true });
evaluationSchema.index({ applicationId: 1 }, { sparse: true });
evaluationSchema.index({ isReviewed: 1 });
evaluationSchema.index({ isSubmitted: 1 });

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;