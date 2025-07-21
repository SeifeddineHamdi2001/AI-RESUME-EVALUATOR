import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    const jobs = await Job.find({}).sort(sort);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Post a new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const postJob = async (req, res) => {
  try {
    const { title, description, location, requiredSkills, company } = req.body;
    const newJob = new Job({
      title,
      description,
      location,
      requiredSkills,
      company,
      recruiterId: req.user.id,
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Get jobs by recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
const getJobsByRecruiter = async (req, res) => {
  try {
    console.log("getJobsByRecruiter called");
    console.log("Request headers:", req.headers);
    console.log("req.user:", req.user);
    
    // Check for authentication
    if (!req.user) {
      console.error("Authentication failed: No user object in request");
      return res.status(401).json({ message: "Authentication failed" });
    }
    
    // Validate user ID
    if (!req.user.id) {
      console.error("Invalid user object:", req.user);
      return res.status(400).json({ message: "Invalid user in token" });
    }
    
    console.log("Searching for jobs with recruiterId:", req.user.id);
    const jobs = await Job.find({ recruiterId: req.user.id });
    console.log("Jobs retrieved:", jobs.length);
    
    if (jobs.length === 0) {
      console.log("No jobs found for recruiterId:", req.user.id);
    } else {
      console.log("First job recruiterId:", jobs[0].recruiterId);
    }

    res.json(jobs);
  } catch (error) {
    console.error("Error in getJobsByRecruiter:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the user is the recruiter who posted the job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export default {
  getJobs,
  postJob,
  getJobsByRecruiter,
  deleteJob,
  updateJob,
  getJobById,
};