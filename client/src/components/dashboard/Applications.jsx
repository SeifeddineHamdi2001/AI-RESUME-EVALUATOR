import React, { useState } from 'react';
import '../../assets/styles/Applications.css';
import { FaFileAlt, FaSearch } from 'react-icons/fa';

const mockApplications = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechVision',
    status: 'In Review',
    resumeUrl: '#'
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'DataX Inc.',
    status: 'Accepted',
    resumeUrl: '#'
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    company: 'CloudOps',
    status: 'Refused',
    resumeUrl: '#'
  }
];

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || app.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
          <option value="In Review">In Review</option>
          <option value="Accepted">Accepted</option>
          <option value="Refused">Refused</option>
        </select>
      </div>

      <div className="application-list">
        {filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          filteredApplications.map((application) => (
            <div className="application-card" key={application.id}>
              <div className="application-info">
                <h3 className="application-title">{application.title}</h3>
                <p className="application-company">{application.company}</p>
                <span className={`status-badge status-${application.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {application.status}
                </span>
              </div>

              <div className="resume-section">
                <span className="resume-label">Resume Used:</span>
                <a
                  href={application.resumeUrl}
                  className="resume-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFileAlt className="resume-icon" />
                  View Resume
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;
