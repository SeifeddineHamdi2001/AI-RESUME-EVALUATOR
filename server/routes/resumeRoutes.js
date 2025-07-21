import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  uploadResume,
  getUserResumes,
  getUserEvaluations,
  getResumeEvaluations,
  deleteResume,
  viewResume,
} from '../controllers/resumeController.js';

// @desc    Upload a resume
// @route   POST /api/resumes/upload
// @access  Private (Candidate)
router.post('/upload', protect, upload, uploadResume);

// @desc    Get all resumes for the current user
// @route   GET /api/resumes/user
// @access  Private
router.get('/user', protect, getUserResumes);

// @desc    Get all evaluations for a user
// @route   GET /api/resumes/evaluations
// @access  Private
router.get('/evaluations', protect, getUserEvaluations);

// @desc    Get all evaluations for a resume
// @route   GET /api/resumes/evaluations/:resumeId
// @access  Private
router.get('/evaluations/:resumeId', protect, getResumeEvaluations);

// @desc    Get all resumes for a specific user (for admin/recruiter use)
// @route   GET /api/resumes/:userId
// @access  Private
router.get('/:userId', protect, getUserResumes);

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
router.delete('/:id', protect, deleteResume);

// @desc    View a resume
// @route   GET /api/resumes/view/:id
// @access  Private
router.get('/view/:id', protect, viewResume);

export default router;