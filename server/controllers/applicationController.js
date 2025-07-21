import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import EvaluationResult from '../models/EvaluationResult.js';
import { evaluateResumeWithAI } from '../services/aiservice.js';

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Private (Candidate)
export const submitApplication = async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;
    const candidateId = req.user.id;

    // Validate required fields
    if (!jobId || !resumeId) {
      return res.status(400).json({ message: 'Job ID and Resume ID are required' });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Verify the resume exists and belongs to the user
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.candidate.toString() !== candidateId) {
      return res.status(403).json({ message: 'Not authorized to use this resume' });
    }

    // Verify the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = new Application({
      job: jobId,
      candidate: candidateId,
      resume: resumeId,
      status: 'Submitted'
    });

    await application.save();
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: application
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all applications for a candidate
// @route   GET /api/applications
// @access  Private (Candidate)
export const getApplicationsByCandidate = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({ path: 'job', select: 'title company' })
      .populate({ path: 'resume', select: 'originalName' });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate('candidate', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:applicationId/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ensure the user is a recruiter and is authorized to update the status
    if (req.user.role !== 'Recruiter') {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Get the resume for a specific application
// @route   GET /api/applications/:id/resume
// @access  Private
export const getApplicationResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('resume');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is authorized to view this resume
    // A candidate can view their own application's resume
    // A recruiter can view the resume for a job they posted
    const job = await Job.findById(application.job);
    if (req.user.id !== application.candidate.toString() && req.user.id !== job.recruiter.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this resume' });
    }

    if (!application.resume) {
      return res.status(404).json({ message: 'Resume not found for this application' });
    }

    res.json({ resumePath: application.resume.path });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Get all applications for a recruiter
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter)
export const getApplicationsByRecruiter = async (req, res) => {
  try {
    // Find all jobs posted by the recruiter
    const jobs = await Job.find({ recruiterId: req.user.id });
    const jobIds = jobs.map(job => job._id);

    // Find all applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title')
      .populate('candidate', 'name email')
      .populate('resume'); // Populate all resume fields

    // For each application, find the evaluation result (if any)
    const applicationsWithEvaluation = await Promise.all(applications.map(async (app) => {
      const evaluation = await EvaluationResult.findOne({
        resumeId: app.resume._id,
        jobOfferId: app.job._id
      });
      return {
        ...app.toObject(),
        evaluation: evaluation ? {
          score: evaluation.score,
          suggestions: evaluation.suggestions,
          evaluatedAt: evaluation.evaluatedAt,
          feedback: evaluation.feedback || null
        } : null
      };
    }));

    res.json(applicationsWithEvaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Evaluate resume against job description
// @route   GET /api/applications/evaluate
// @access  Private (Candidate)
export const evaluateResume = async (req, res) => {
  try {
    const { jobId, resumeId } = req.query;
    
    // Validate inputs
    if (!jobId || !resumeId) {
      return res.status(400).json({ message: 'Job ID and Resume ID are required' });
    }
    
    // Get job description
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Get resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Ensure the resume belongs to the current user
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to use this resume' });
    }
    
    // Evaluate resume using AI
    try {
      const evaluation = await evaluateResumeWithAI(job, resume);
      
      // Return evaluation results
      res.json({
        score: evaluation.score,
        suggestions: evaluation.suggestions,
        jobTitle: job.title,
        resumeName: resume.name
      });
    } catch (aiError) {
      console.error('AI evaluation error:', aiError);
      return res.status(500).json({ message: 'Failed to analyze resume', error: aiError.message });
    }
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};