import React, { useState } from "react";
import { FaFileAlt, FaTrashAlt } from "react-icons/fa";

const ResumeList = () => {
  const [resumes, setResumes] = useState([
    { id: 1, name: "resume.pdf", time: "3 hours ago" },
    { id: 2, name: "resume_v2.pdf", time: "1 day ago" }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDelete = (id) => {
    alert(`Delete resume with ID: ${id}`);
    // Here you would implement actual deletion logic
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    alert(`Uploading file: ${selectedFile.name}`);
    // Implement actual upload logic here
    closeUploadModal();
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
        {resumes.map((r) => (
          <li key={r.id} className="resume-item">
            <div className="item-content">
              <FaFileAlt />
              <span>{r.name}</span>
            </div>
            <div className="item-actions">
              <span className="timestamp">{r.time}</span>
              <button className="btn btn-outline" onClick={() => handleDelete(r.id)}>
                <FaTrashAlt color="156064"/>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={closeUploadModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Upload Resume</h3>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
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
