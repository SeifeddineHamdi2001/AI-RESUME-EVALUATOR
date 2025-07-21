import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Interviewing','Rejected', 'Accepted'],
    default: 'Submitted',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Application', ApplicationSchema);