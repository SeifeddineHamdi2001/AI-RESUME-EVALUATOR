import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import EvaluationResult from '../models/EvaluationResult.js';
import { evaluateResumeWithAI } from '../services/aiservice.js';

export const evaluateResume = async (req, res) => {
  try {
    const { resumeId, jobId } = req.query;

    if (!resumeId || !jobId) {
      return res.status(400).json({ message: 'Resume ID and Job ID are required' });
    }

    // Fetch resume and job data
    const resume = await Resume.findById(resumeId);
    const job = await Job.findById(jobId);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure user owns this resume
    if (resume.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to evaluate this resume' });
    }

    try {
      // Use the AI service to evaluate the resume
      const evaluation = await evaluateResumeWithAI(job, resume);

      // Save evaluation result
      const evaluationResult = new EvaluationResult({
        resumeId: resume._id,
        jobOfferId: job._id, // <-- FIXED: use jobOfferId to match model
        candidateId: req.user.id,
        score: evaluation.score,
        suggestions: evaluation.feedback?.ai_feedback?.ImprovementSuggestions || [],
        evaluatedAt: new Date()
      });

      await evaluationResult.save();

      res.json({
        success: true,
        evaluationId: evaluationResult._id,
        score: evaluation.score,
        suggestions: evaluation.feedback?.ai_feedback?.ImprovementSuggestions || [],
        feedback: evaluation.feedback,
        structured_resume: evaluation.structured_resume,
        resumeName: resume.originalName,
        jobTitle: job.title
      });
    } catch (aiError) {
      // Handle AI engine errors
      console.error('AI evaluation error:', aiError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to analyze resume', 
        error: aiError.message 
      });
    }
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await EvaluationResult.findById(req.params.id)
      .populate('resumeId', 'originalName')
      .populate('jobId', 'title company');

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Ensure user is authorized to view this evaluation
    if (evaluation.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this evaluation' });
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const evaluateResumeForJob = async (req, res) => {
  try {
    const { resumeId, jobId } = req.params;

    // Fetch resume and job data
    const resume = await Resume.findById(resumeId);
    const job = await Job.findById(jobId);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure user owns this resume
    if (resume.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to evaluate this resume' });
    }

    try {
      // Use the AI service to evaluate the resume
      const evaluation = await evaluateResumeWithAI(job, resume);

      // Save evaluation result
      const evaluationResult = new EvaluationResult({
        resumeId: resume._id,
        jobOfferId: job._id, // <-- FIXED: use jobOfferId to match model
        candidateId: req.user.id,
        score: evaluation.score,
        suggestions: evaluation.feedback?.ai_feedback?.ImprovementSuggestions || [],
        evaluatedAt: new Date()
      });

      await evaluationResult.save();

      res.json({
        success: true,
        evaluationId: evaluationResult._id,
        score: evaluation.score,
        suggestions: evaluation.feedback?.ai_feedback?.ImprovementSuggestions || [],
        feedback: evaluation.feedback,
        structured_resume: evaluation.structured_resume,
        resumeName: resume.originalName,
        jobTitle: job.title
      });
    } catch (aiError) {
      // Handle AI engine errors
      console.error('AI evaluation error:', aiError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to analyze resume', 
        error: aiError.message 
      });
    }
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get evaluations for a user
// @route   GET /api/evaluate/user/:userId
// @access  Private
export const getEvaluationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log('Getting evaluations for user:', userId);

    // Fetch user resumes
    const resumes = await Resume.find({ candidate: userId });

    console.log('User resumes found:', resumes.length);
    console.log('Resume IDs:', resumes.map(resume => resume._id));

    // Fetch evaluations for user resumes
    const evaluations = await EvaluationResult.find({ resumeId: { $in: resumes.map(resume => resume._id) } });

    console.log('Evaluations found:', evaluations.length);
    console.log('Evaluation data:', evaluations);

    res.json(evaluations);
  } catch (error) {
    console.error('Error getting evaluations for user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};