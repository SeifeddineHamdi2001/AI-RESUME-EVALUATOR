import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import jobController from "../controllers/jobController.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get("/", jobController.getJobs);

// @desc    Get jobs by recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
router.get('/my-jobs', protect, jobController.getJobsByRecruiter);

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
router.get("/:id", jobController.getJobById);

// @desc    Post a new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
router.post('/', protect, jobController.postJob);

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
router.delete("/:id", protect, jobController.deleteJob);
router.put("/:id", protect, jobController.updateJob);

export default router;