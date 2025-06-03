import React, { useState } from 'react';
import { FaSearch, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import '../../assets/styles/BrowseJobs.css';
import { Navigate,useNavigate } from 'react-router-dom';

const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer - React',
    company: 'TechVision',
    location: 'Remote',
    description: 'We are looking for a React developer to build scalable web applications.',
    skills: ['React', 'JavaScript', 'CSS', 'REST API']
  },
  {
    id: 2,
    title: 'Data Scientist - Entry Level',
    company: 'DataX Inc.',
    location: 'Tunis, Tunisia',
    description: 'Analyze large datasets to uncover patterns and improve products.',
    skills: ['Python', 'Machine Learning', 'SQL']
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    company: 'CloudOps',
    location: 'Hybrid - Paris',
    description: 'Support CI/CD infrastructure and improve automation pipelines.',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS']
  }
];

const BrowseJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const filteredJobs = mockJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="browse-jobs-split bordered-layout">
      <div className="left-column bordered">
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <FaFilter /> Filters
          </button>
        </div>

        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <p className="no-results">No jobs found.</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                className={`job-card ${selectedJob?.id === job.id ? 'selected' : ''}`}
                key={job.id}
                onClick={() => setSelectedJob(job)}
              >
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-meta">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-column bordered">
        {selectedJob ? (
          <div className="job-detail">
            <h2>{selectedJob.title}</h2>
            <p className="job-meta">{selectedJob.company} • {selectedJob.location}</p>
            <p className="job-description">{selectedJob.description}</p>
            <h4>Required Skills:</h4>
            <ul className="job-skills">
              {selectedJob.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
            <button onClick={() => navigate('/candidate-dashboard/jobs/jobapplication')}
             className="apply-btn">
              Apply <FaExternalLinkAlt size={12} />
            </button>
          </div>
        ) : (
          <p className="select-instruction">Select a job to view details</p>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
