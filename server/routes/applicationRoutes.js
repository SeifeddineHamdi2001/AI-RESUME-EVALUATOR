import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  submitApplication,
  getApplicationsByCandidate,
  getApplicationsByJob,
  updateApplicationStatus,
  getApplicationResume,
  getApplicationsByRecruiter,
} from '../controllers/applicationController.js';

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Private (Candidate)
router.post('/', protect, submitApplication);

// @desc    Get all applications for a candidate
// @route   GET /api/applications
// @access  Private (Candidate)
router.get('/', protect, getApplicationsByCandidate);

// @desc    Get all applications for a recruiter
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter)
router.get('/recruiter', protect, getApplicationsByRecruiter);

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
router.get('/job/:jobId', protect, getApplicationsByJob);

// @desc    Update application status
// @route   PUT /api/applications/:applicationId/status
// @access  Private (Recruiter)
router.put('/:applicationId/status', protect, updateApplicationStatus);

// @desc    Get the resume for a specific application
// @route   GET /api/applications/:id/resume
// @access  Private
router.get('/:id/resume', protect, getApplicationResume);

export default router;