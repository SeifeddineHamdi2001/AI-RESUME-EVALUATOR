import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requiredSkills: {
      type: [String],
      required: true,
    },
    experienceRequired: {
      type: Number,
      default: 0,
    },
    educationRequired: {
      type: String,
      default: "Bachelor's degree",
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', JobSchema);