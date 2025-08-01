// AI Service for resume evaluation (FastAPI client only)
import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import os from 'os';
import path from 'path';

// Load environment variables
dotenv.config();

// URL of the FastAPI server (updated to use NVIDIA API)
const FASTAPI_URL = process.env.FASTAPI_URL || 'https://saif12-mistral-7b-gguf-space.hf.space/evaluate';

/**
 * Evaluates a resume against a job description using the FastAPI AI engine
 * @param {Object} job - Job object with description
 * @param {Object} resume - Resume object with file path
 * @returns {Object} - Evaluation results including score and suggestions
 */
export const evaluateResumeWithAI = async (job, resume) => {
  let tempFilePath = null;
  try {
    // Read the resume file content
    let resumePath;
    try {
      const filePath = resume.filePath || resume.path;
      if (!filePath) throw new Error('Resume file path is missing');
      resumePath = filePath;
      let isUrl = /^https?:\/\//i.test(resumePath);
      if (isUrl) {
        // Download the file to a temp location
        const response = await axios.get(resumePath, { responseType: 'stream' });
        tempFilePath = path.join(os.tmpdir(), `resume_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`);
        const writer = fs.createWriteStream(tempFilePath);
        await new Promise((resolve, reject) => {
          response.data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        resumePath = tempFilePath;
        console.log('Downloaded resume file size:', fs.statSync(resumePath).size);
      } else {
        if (!fs.existsSync(resumePath)) {
          throw new Error('Resume file not found');
        }
        console.log('Local resume file size:', fs.statSync(resumePath).size);
      }
      console.log('Resume path being sent to FastAPI:', resumePath);
    } catch (fileError) {
      console.error('Error reading resume file:', fileError);
      throw new Error('Could not read resume file');
    }

    // Prepare job data for the AI engine
    const jobData = {
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills || [],
      experienceRequired: job.experienceRequired || 0,
      educationRequired: job.educationRequired || "Bachelor's degree"
    };

    // Prepare form data
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(resumePath));
    formData.append('job', JSON.stringify(jobData));

    // Send POST request to FastAPI (now using NVIDIA API)
    const response = await axios.post(FASTAPI_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000, // 2 minutes timeout for API calls
    });

    return response.data;
  } catch (error) {
    console.error('AI evaluation error:', error);
    throw new Error('Failed to evaluate resume: ' + error.message);
  } finally {
    // Clean up temp file if it was used
    if (tempFilePath) {
      try { fs.unlinkSync(tempFilePath); } catch (e) { /* ignore */ }
    }
  }
};