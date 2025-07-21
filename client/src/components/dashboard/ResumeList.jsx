import React, { useState, useEffect, useContext } from "react";
import { FaFileAlt, FaTrashAlt } from "react-icons/fa";
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";

const ResumeList = () => {
  const { token, user } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(resumes.length / ITEMS_PER_PAGE);
  const paginatedResumes = resumes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const fetchResumes = async () => {
    if (!token || !user) return;
    try {
      const { data } = await axios.get(`https://ai-resume-evaluator-j4px.onrender.com/api/resumes/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setResumes(data);
    } catch (err) {
      setError('Failed to fetch resumes.');
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [token, user]);

  const handleDelete = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`https://ai-resume-evaluator-j4px.onrender.com/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResumes();
    } catch (err) {
      setError('Failed to delete resume.');
    }
  };

  const handleView = async (id) => {
    if (!token) return;
    try {
      const response = await axios.get(`https://ai-resume-evaluator-j4px.onrender.com/api/resumes/view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(fileURL, '_blank');
    } catch (err) {
      setError('Failed to view resume.');
    }
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setError('');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    if (!token) {
      setError('Authentication error. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await axios.post('https://ai-resume-evaluator-j4px.onrender.com/api/resumes/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      closeUploadModal();
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="candidate-card">
      <div className="section-header">
        <h2 className="section-title">Uploaded Resumes</h2>
        <button className="btn btn-primary" onClick={openUploadModal}>
          <FaFileAlt/>
          Upload New
        </button>
      </div>
      <ul className="resume-list">
        {paginatedResumes.map((r) => (
          <li key={r._id} className="resume-item">
           <div className="item-content">
             <FaFileAlt />
             <span>{r.originalName}</span>
           </div>
           <div className="item-actions">
             <span className="timestamp">{new Date(r.uploadDate).toLocaleDateString()}</span>
             <button className="btn btn-outline" onClick={() => handleView(r._id)}>
                View
              </button>
             <button className="btn btn-outline" onClick={() => handleDelete(r._id)}>
               <FaTrashAlt color="156064"/>
             </button>
           </div>
          </li>
        ))}
      </ul>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={closeUploadModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Upload Resume</h3>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
              <button className="btn btn-outline" onClick={closeUploadModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add some basic styles for modal */}
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
      `}</style>
    </div>
  );
};

export default ResumeList;
