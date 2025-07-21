import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/Applications.css';
import { FaFileAlt, FaSearch, FaHourglass, FaUserCheck, FaComments, FaGift, FaTimesCircle } from 'react-icons/fa';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/applications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setApplications(res.data);
        console.log('Applications:', res.data);
      } catch (error) {
        console.error('Error fetching applications', error);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const handleViewResume = async (application) => {
    try {
      // Use the resumeId from the application object
      const resumeId = application.resume?._id || application.resumeId || application.resume;
      if (!resumeId) {
        alert('No resume found for this application.');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/resumes/view/${resumeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Failed to view resume.', error);
      alert('Failed to view resume.');
    }
  };

  const statusIcons = {
    'Submitted': <FaHourglass style={{ marginRight: 6, color: '#b8860b' }} />,
    'Under Review': <FaUserCheck style={{ marginRight: 6, color: '#156064' }} />,
    'Interviewing': <FaComments style={{ marginRight: 6, color: '#007bff' }} />,
    'Offered': <FaGift style={{ marginRight: 6, color: '#28a745' }} />,
    'Rejected': <FaTimesCircle style={{ marginRight: 6, color: '#dc3545' }} />,
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && (statusFilter === 'All' || app.status === statusFilter);
  });

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="applications-container">
      <h2 className="applications-title">My Applications</h2>

      <div className="applications-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="application-list">
        {paginatedApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          paginatedApplications.map((application) => (
            <div className="application-card" key={application._id}>
              <div className="application-info">
                <h3 className="application-title">{application.job.title}</h3>
                <p className="application-company">{application.job.company}</p>
                <span className={`status-badge status-${application.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {statusIcons[application.status]}
                  {application.status}
                </span>
              </div>

              <div className="resume-section">
                <span className="resume-label">Resume Used:</span>
                <button
                  onClick={() => handleViewResume(application)}
                  className="resume-link"
                >
                  <FaFileAlt className="resume-icon" />
                  View Resume
                </button>
              </div>
            </div>
          ))
        )}
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
    </div>
  );
};

export default Applications;
