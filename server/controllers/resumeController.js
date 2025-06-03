// In resumeController.js
const response = await axios.post('http://ai-engine:5000/evaluate', { resume, jobDescription });