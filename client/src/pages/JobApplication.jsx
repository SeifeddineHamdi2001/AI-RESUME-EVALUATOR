import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../src/assets/styles/JobApplication.css';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const [existingResumes, setExistingResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);

  const openChooseModal = async () => {
  setIsChooseModalOpen(true);
  setSelectedResumeId(null);
  setIsLoadingResumes(true);

  try {
    const response = await axios.get('/api/getUserResumes'); // Adjust your API endpoint
    setExistingResumes(response.data.resumes || []);
  } catch (err) {
    alert('Failed to fetch existing resumes.');
  }
  setIsLoadingResumes(false);
};

const closeChooseModal = () => {
  setIsChooseModalOpen(false);
  setSelectedResumeId(null);
};

const handleResumeSelect = (resumeId) => {
  setSelectedResumeId(resumeId);
};

const handleChooseResume = async () => {
  if (!selectedResumeId) {
    alert('Please select a resume first.');
    return;
  }
  setIsChoosing(true);
  try {
    await axios.put('/api/selectResume', { resumeId: selectedResumeId, jobId }); // Adjust API to link chosen resume with job
    alert('Resume selected successfully!');
    closeChooseModal();

    // Refresh evaluation with the chosen resume
    const response = await axios.get(`/api/evaluateResume?jobId=${jobId}`);
    setEvaluation(response.data.evaluation || null);
    setResumeInfo(response.data.resumeInfo || null);
    setError(null);
  } catch (err) {
    alert('Failed to select resume. Please try again.');
  }
  setIsChoosing(false);
};


  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await axios.get(`/api/evaluateResume?jobId=${jobId}`);
        setEvaluation(response.data.evaluation || null);
        setResumeInfo(response.data.resumeInfo || null);
        setError(null);
      } catch (err) {
        setError('Failed to analyze resume. Please try again.');
        setEvaluation(null);
        setResumeInfo(null);
      }
    };

    fetchEvaluation();
  }, [jobId]);

  const openModal = () => {
    setIsModalOpen(true);
    setSelectedFile(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await axios.put('/api/uploadResume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Resume uploaded successfully!');
      setIsUploading(false);
      closeModal();

      // Refresh evaluation and resume info
      const response = await axios.get(`/api/evaluateResume?jobId=${jobId}`);
      setEvaluation(response.data.evaluation || null);
      setResumeInfo(response.data.resumeInfo || null);
      setError(null);
    } catch (err) {
      alert('Failed to upload resume. Please try again.');
      setIsUploading(false);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/submitApplication', { jobId });
      alert('Application submitted successfully!');
      navigate('/applications'); // Redirect after submission
    } catch (err) {
      alert('Failed to submit application, please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="job-application-container">
      <div className="card">
        <h2>Resume Evaluation</h2>
        {evaluation ? (
          <>
            <p><strong>Score:</strong> {evaluation.score}%</p>
            <p><strong>Suggestions:</strong> {evaluation.suggestions}</p>
          </>
        ) : (
          <p>No evaluation data available.</p>
        )}

        <h3>Candidate Information</h3>
        {resumeInfo ? (
          <>
            <p><strong>Name:</strong> {resumeInfo.name || 'No data yet'}</p>
            <p><strong>Email:</strong> {resumeInfo.email || 'No data yet'}</p>
            <p><strong>Phone:</strong> {resumeInfo.phone || 'No data yet'}</p>

            <h4>Experience</h4>
            {resumeInfo.experience && resumeInfo.experience.length > 0 ? (
              <ul>{resumeInfo.experience.map((exp, idx) => <li key={idx}>{exp}</li>)}</ul>
            ) : (
              <p>No experience information available.</p>
            )}

            <h4>Education</h4>
            {resumeInfo.education && resumeInfo.education.length > 0 ? (
              <ul>{resumeInfo.education.map((edu, idx) => <li key={idx}>{edu}</li>)}</ul>
            ) : (
              <p>No education information available.</p>
            )}
          </>
        ) : (
          <p>No candidate information available.</p>
        )}

        {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={openModal}
          className="btn btn-primary upload-new-btn"
          >
        Upload New
        </button>
        <button onClick={openChooseModal} className="btn btn-secondary choose-existing-btn">
        Choose Existing
        </button>
        </div>
        </div>
      <div className="button-container">
  <button
    onClick={() => navigate('/candidate-dashboard/jobs')}
    className="btn btn-primary confirm-btn cancel-btn"
  >
    Cancel
  </button>
  <button
    onClick={handleSubmitApplication}
    disabled={isSubmitting}
    className="btn btn-primary confirm-btn"
  >
    {isSubmitting ? 'Submitting...' : 'Confirm Application'}
  </button>
</div>


      {/* Polished Upload Modal */}
      {/* Upload Modal */}
{isModalOpen && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h3>Upload New Resume</h3>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      <div className="modal-buttons">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          className="btn btn-outline"
          onClick={closeModal}
          disabled={isUploading}
        >
          Cancel
        </button>
      </div>
    </div>

    {/* Modal styles */}
    <style>{`
      .modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal {
        background: white;
        padding: 1.5rem;
        border-radius: 6px;
        max-width: 400px;
        width: 90%;
      }
      .modal-buttons {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        min-width: 100px;
        font-size: 1rem;
      }
      .btn-primary {
        background-color: #2563eb;
        border: none;
        color: white;
      }
      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      .btn-outline {
        background: transparent;
        border: 1.5px solid #6b7280;
        color: #6b7280;
      }
      .btn-outline:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `}</style>
  </div>
)}
{isChooseModalOpen && (
  <div className="modal-overlay" onClick={closeChooseModal}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>Select a Resume</h3>

      {isLoadingResumes ? (
        <p>Loading resumes...</p>
      ) : existingResumes.length === 0 ? (
        <p>No existing resumes found.</p>
      ) : (
        <ul className="resume-list">
          {existingResumes.map((resume) => (
            <li key={resume.id}>
              <label>
                <input
                  type="radio"
                  name="resume"
                  value={resume.id}
                  checked={selectedResumeId === resume.id}
                  onChange={() => handleResumeSelect(resume.id)}
                />
                {resume.fileName || `Resume #${resume.id}`} {/* Adjust as needed */}
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="modal-buttons">
        <button
          className="btn btn-primary"
          onClick={handleChooseResume}
          disabled={isChoosing || !selectedResumeId}
        >
          {isChoosing ? 'Selecting...' : 'Select'}
        </button>
        <button
          className="btn btn-outline"
          onClick={closeChooseModal}
          disabled={isChoosing}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default JobApplication;
