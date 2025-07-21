import Resume from '../models/Resume.js';
import EvaluationResult from '../models/EvaluationResult.js';

export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const newResume = new Resume({
      candidate: req.user.id,
      filePath: req.file.path, // Cloudinary URL
      originalName: req.file.originalname,
    });

    await newResume.save();
    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    // Use the current user's ID from the authentication token
    const resumes = await Resume.find({ candidate: req.user.id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Optional: Check if the user owns the resume
    if (resume.candidate.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete all evaluations associated with this resume
    const deletedEvaluations = await EvaluationResult.deleteMany({ resumeId: resume._id });
    console.log(`Deleted ${deletedEvaluations.deletedCount} evaluations for resume ${resume._id}`);

    // Delete the resume
    await Resume.deleteOne({ _id: req.params.id });
    
    res.json({ 
      message: 'Resume and associated evaluations removed',
      deletedEvaluations: deletedEvaluations.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const viewResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Optional: Check if the user owns the resume or has permission
    if (resume.candidate.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Instead of sending a file, redirect to the Cloudinary URL
    return res.redirect(resume.filePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserEvaluations = async (req, res) => {
  try {
    const { sortBy = 'evaluatedAt', sortOrder = 'desc' } = req.query;

    console.log('Getting evaluations for user:', req.user.id);

    // Find resumes for the current user
    const userResumes = await Resume.find({ candidate: req.user.id }).select(
      '_id'
    );
    console.log('User resumes found:', userResumes.length);
    console.log('Resume IDs:', userResumes.map(r => r._id));
    
    if (!userResumes.length) {
      console.log('No resumes found for user, returning empty array');
      return res.json([]);
    }
    const resumeIds = userResumes.map((r) => r._id);

    // Find evaluations for those resumes and sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    console.log('Looking for evaluations with resumeIds:', resumeIds);
    
    const evaluations = await EvaluationResult.find({
      resumeId: { $in: resumeIds },
    })
      .populate({
        path: 'resumeId',
        select: 'originalName',
      })
      .sort(sort);

    console.log('Evaluations found:', evaluations.length);
    console.log('Evaluation data:', evaluations);

    res.json(evaluations);
  } catch (error) {
    console.error('Error in getUserEvaluations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getResumeEvaluations = async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    // Check if the resume exists and belongs to the user
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Security check: only the owner can view their resume evaluations
    if (resume.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these evaluations' });
    }
    
    // Find all evaluations for this resume
    const evaluations = await EvaluationResult.find({ resumeId })
      .populate('jobId', 'title company')
      .sort({ evaluatedAt: -1 });
    
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};