import express from 'express';
import { protect } from '../middleware/auth.js';
import { evaluateResume, getEvaluationById, evaluateResumeForJob } from '../controllers/evaluationcontroller.js';

const router = express.Router();

// @desc    Evaluate resume against job description
// @route   GET /api/evaluate
// @access  Private
router.get('/', protect, evaluateResume);

// @desc    Evaluate resume for specific job (for job application flow)
// @route   GET /api/evaluate/resume/:resumeId/job/:jobId
// @access  Private
router.get('/resume/:resumeId/job/:jobId', protect, evaluateResumeForJob);

// @desc    Get evaluation result by ID
// @route   GET /api/evaluate/:id
// @access  Private
router.get('/:id', protect, getEvaluationById);

export default router;