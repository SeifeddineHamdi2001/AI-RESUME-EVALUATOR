// User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['Candidate', 'Recruiter'] },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;


