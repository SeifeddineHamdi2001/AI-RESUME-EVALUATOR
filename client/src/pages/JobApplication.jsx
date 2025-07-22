import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/JobApplication.css";

// Helper function to clean text encoding issues
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\uFFFD/g, '') // Remove replacement characters
    .replace(/[^\x00-\x7F]/g, (char) => {
      // Try to fix common special characters
      const replacements = {
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'à': 'a', 'â': 'a', 'ä': 'a',
        'î': 'i', 'ï': 'i',
        'ô': 'o', 'ö': 'o',
        'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n',
        'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
        'À': 'A', 'Â': 'A', 'Ä': 'A',
        'Î': 'I', 'Ï': 'I',
        'Ô': 'O', 'Ö': 'O',
        'Ù': 'U', 'Û': 'U', 'Ü': 'U',
        'Ç': 'C', 'Ñ': 'N'
      };
      return replacements[char] || char;
    });
};

export default function JobApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  
  // State management
  const [job, setJob] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('resume-selection'); // resume-selection, evaluation, confirmation
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(userResumes.length / ITEMS_PER_PAGE);
  const paginatedResumes = userResumes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Get job data from navigation state or URL params
  useEffect(() => {
    if (location.state?.job) {
      setJob(location.state.job);
    } else {
      // If no job in state, redirect back to jobs
      navigate('/candidate-dashboard/jobs');
    }
  }, [location.state, navigate]);

  // Fetch user's resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        // Use a route that gets resumes for the current authenticated user
        const response = await fetch('https://ai-resume-evaluator-j4px.onrender.com/api/resumes/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched resumes:', data);
          setUserResumes(data);
        } else {
          console.error('Failed to fetch resumes:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    if (token) {
      fetchResumes();
    }
  }, [token]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setSelectedResume(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  // Handle resume selection
  const handleResumeSelect = (resume) => {
    setSelectedResume(resume);
    setUploadedFile(null);
    setError(null);
  };

  // Upload new resume
  const uploadNewResume = async () => {
    if (!uploadedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const response = await fetch('https://ai-resume-evaluator-j4px.onrender.com/api/resumes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newResume = await response.json();
        setUserResumes([...userResumes, newResume]);
        setSelectedResume(newResume);
        setUploadedFile(null);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload resume');
      }
    } catch (error) {
      setError('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  // Evaluate resume
  const evaluateResume = async () => {
    if (!selectedResume) {
      setError('Please select or upload a resume first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://ai-resume-evaluator-j4px.onrender.com/api/evaluate/resume/${selectedResume._id}/job/${job._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const evaluationData = await response.json();
        setEvaluation(evaluationData);
        setStep('evaluation');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to evaluate resume');
      }
    } catch (error) {
      setError('Failed to evaluate resume');
    } finally {
      setLoading(false);
    }
  };

  // Submit application
  const submitApplication = async () => {
    if (!selectedResume) {
      setError('Resume is required to submit application');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ai-resume-evaluator-j4px.onrender.com/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: job._id,
          resumeId: selectedResume._id,
        }),
      });

      if (response.ok) {
        setStep('confirmation');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      setError('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  // Handle view PDF
  const handleViewPdf = (url) => {
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  // Render resume selection step
  const renderResumeSelection = () => (
    <div className="resume-selection">
      <h2>Select or Upload Resume</h2>
      <p>Choose an existing resume or upload a new one for this application.</p>

      <div className="resume-options">
        <div className="existing-resumes">
          <h3>Existing Resumes</h3>
          {userResumes.length === 0 ? (
            <p>No resumes found. Please upload a new one.</p>
          ) : (
            <>
              <div className="resume-list">
                {paginatedResumes.map((resume) => (
                  <div
                    key={resume._id}
                    className={`resume-item ${selectedResume?._id === resume._id ? 'selected' : ''}`}
                    onClick={() => handleResumeSelect(resume)}
                  >
                    <h4>{resume.originalName}</h4>
                    <p>Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 8 }}
                      onClick={e => { e.stopPropagation(); handleViewPdf(resume.filePath); }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&laquo;</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={currentPage === i + 1 ? 'active' : ''}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&raquo;</button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="upload-resume">
          <h3>Upload New Resume</h3>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            Upload New
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-container">
        <button onClick={() => navigate('/candidate-dashboard/jobs')} className="btn cancel-btn">
          Cancel
        </button>
        <button
          onClick={evaluateResume}
          disabled={!selectedResume || loading}
          className="btn btn-primary"
        >
          {loading ? 'Evaluating...' : 'Evaluate Resume'}
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content upload-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowUploadModal(false)}>&times;</button>
            <h3>Upload Resume (PDF)</h3>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="file-input"
            />
            {uploadedFile && (
              <div className="upload-preview">
                <p>Selected: {uploadedFile.name}</p>
                <button onClick={uploadNewResume} disabled={loading} className="btn btn-primary upload-btn">
                  {loading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {showPdfModal && (
        <div className="modal" onClick={() => setShowPdfModal(false)}>
          <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowPdfModal(false)}>&times;</button>
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              className="pdf-iframe"
              title="Resume PDF"
            />
          </div>
        </div>
      )}
    </div>
  );

  // Render evaluation results
  const renderEvaluation = () => (
    <div className="evaluation-results">
      <h2>Resume Evaluation Results</h2>
      
      {evaluation && (
        <div className="evaluation-content">
          <div className="score-section">
            <h3>Overall Score: {evaluation.score}%</h3>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${evaluation.score}%` }}
              ></div>
            </div>
          </div>

          <div className="feedback-section">
            <h3>Detailed Feedback</h3>
            
            {evaluation.feedback && (
              <>
                <div className="feedback-item">
                  <h4>Skills Match: {evaluation.feedback.skills?.match || 0}%</h4>
                  {evaluation.feedback.skills?.missing?.length > 0 && (
                    <p><strong>Missing Skills:</strong> {evaluation.feedback.skills.missing.join(', ')}</p>
                  )}
                </div>

                <div className="feedback-item">
                  <h4>Experience Match: {evaluation.feedback.experience?.match || 0}%</h4>
                  {evaluation.feedback.experience?.gap > 0 && (
                    <p><strong>Experience Gap:</strong> {evaluation.feedback.experience.gap} years</p>
                  )}
                </div>

                <div className="feedback-item">
                  <h4>Education Match: {evaluation.feedback.education?.match || 0}%</h4>
                </div>
              </>
            )}

                        {evaluation.feedback?.ai_feedback && (
              <div className="ai-feedback">
                <h4>AI Analysis</h4>
                {evaluation.feedback.ai_feedback.Summary && (
                  <p><strong>Summary:</strong> {evaluation.feedback.ai_feedback.Summary}</p>
                )}
                
                {evaluation.feedback.ai_feedback.Strengths?.length > 0 && (
                  <div>
                    <strong>Strengths:</strong>
                    <ul>
                      {evaluation.feedback.ai_feedback.Strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {evaluation.feedback.ai_feedback.AreasForImprovement?.length > 0 && (
                  <div>
                    <strong>Areas for Improvement:</strong>
                    <ul>
                      {evaluation.feedback.ai_feedback.AreasForImprovement.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {evaluation.feedback.ai_feedback.ImprovementSuggestions?.length > 0 && (
                  <div>
                    <strong>Suggestions for Improvement:</strong>
                    <ul>
                      {evaluation.feedback.ai_feedback.ImprovementSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {evaluation.feedback.ai_feedback.Recommendation && (
                  <p><strong>Recommendation:</strong> {evaluation.feedback.ai_feedback.Recommendation}</p>
                )}
              </div>
            )}

            {/* Extracted Resume Information */}
            {evaluation.structured_resume && (
              <div className="extracted-resume">
                <h4>Extracted Resume Information</h4>
                
                {evaluation.structured_resume.personal_info && (
                  <div className="resume-section">
                    <h5>Personal Information</h5>
                    <p><strong>Name:</strong> {cleanText(evaluation.structured_resume.personal_info.name)}</p>
                    <p><strong>Email:</strong> {cleanText(evaluation.structured_resume.personal_info.email)}</p>
                    <p><strong>Phone:</strong> {cleanText(evaluation.structured_resume.personal_info.phone)}</p>
                    {evaluation.structured_resume.personal_info.location && (
                      <p><strong>Location:</strong> {cleanText(evaluation.structured_resume.personal_info.location)}</p>
                    )}
                  </div>
                )}

                {evaluation.structured_resume.summary && (
                  <div className="resume-section">
                    <h5>Professional Summary</h5>
                    <p>{cleanText(evaluation.structured_resume.summary)}</p>
                  </div>
                )}

                {evaluation.structured_resume.education && evaluation.structured_resume.education.length > 0 && (
                  <div className="resume-section">
                    <h5>Education</h5>
                    {evaluation.structured_resume.education.map((edu, index) => (
                      <div key={index} className="education-item">
                        <p><strong>{edu.degree}</strong></p>
                        <p>{edu.institution} ({edu.duration})</p>
                        {edu.courses && edu.courses.length > 0 && (
                          <ul>
                            {edu.courses.map((course, courseIndex) => (
                              <li key={courseIndex}>{course}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {evaluation.structured_resume.experience && evaluation.structured_resume.experience.length > 0 && (
                  <div className="resume-section">
                    <h5>Experience</h5>
                    {evaluation.structured_resume.experience.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <p><strong>{exp.role}</strong> at {exp.company}</p>
                        <p>{exp.duration}</p>
                        {exp.description && (
                          <ul>
                            {Array.isArray(exp.description) ? 
                              exp.description.map((desc, descIndex) => (
                                <li key={descIndex}>{desc}</li>
                              )) : 
                              <li>{exp.description}</li>
                            }
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {evaluation.structured_resume.skills && evaluation.structured_resume.skills.length > 0 && (
                  <div className="resume-section">
                    <h5>Skills</h5>
                    <div className="skills-container">
                      {evaluation.structured_resume.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {evaluation.structured_resume.projects && evaluation.structured_resume.projects.length > 0 && (
                  <div className="resume-section">
                    <h5>Projects</h5>
                    {evaluation.structured_resume.projects.map((project, index) => (
                      <div key={index} className="project-item">
                        <p><strong>{project.name}</strong></p>
                        {project.description && (
                          <ul>
                            {Array.isArray(project.description) ? 
                              project.description.map((desc, descIndex) => (
                                <li key={descIndex}>{desc}</li>
                              )) : 
                              <li>{project.description}</li>
                            }
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {evaluation.structured_resume.languages && evaluation.structured_resume.languages.length > 0 && (
                  <div className="resume-section">
                    <h5>Languages</h5>
                    <ul>
                      {evaluation.structured_resume.languages.map((lang, index) => (
                        <li key={index}>
                          {typeof lang === 'object' && lang.language && lang.proficiency 
                            ? `${lang.language} - ${lang.proficiency}`
                            : typeof lang === 'string' 
                              ? lang 
                              : JSON.stringify(lang)
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="button-container">
        <button onClick={() => setStep('resume-selection')} className="btn cancel-btn">
          Back to Resume Selection
        </button>
        <button
          onClick={submitApplication}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );

  // Render confirmation
  const renderConfirmation = () => (
    <div className="confirmation">
      <div className="success-message">
        <h2>Application Submitted Successfully!</h2>
        <p>Your application for <strong>{job?.title}</strong> has been submitted.</p>
        <p>You will be notified about the status of your application.</p>
      </div>

      <div className="button-container">
        <button onClick={() => navigate('/candidate-dashboard/applications')} className="btn btn-primary">
          View My Applications
        </button>
        <button onClick={() => navigate('/candidate-dashboard/jobs')} className="btn">
          Browse More Jobs
        </button>
      </div>
        </div>
  );

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-application-container">
      <div className="job-application-header">
        <h1>Apply for {job.title}</h1>
        <p>{job.company} • {job.location}</p>
      </div>

      {step === 'resume-selection' && renderResumeSelection()}
      {step === 'evaluation' && renderEvaluation()}
      {step === 'confirmation' && renderConfirmation()}
      </div>
  );
}
