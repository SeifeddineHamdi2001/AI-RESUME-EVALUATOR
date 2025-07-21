import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import '../../assets/styles/BrowseJobs.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [sort, setSort] = useState({ by: 'createdAt', order: 'desc' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs?sortBy=${sort.by}&sortOrder=${sort.order}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJobs();
    }
  }, [token, sort]);

  const handleSort = (by, order) => {
    setSort({ by, order });
    setIsFilterOpen(false);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="browse-jobs-split">
      <div className="left-column">
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
          <div className="filter-container">
            <button
              className="filter-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FaFilter /> Filters
            </button>
            {isFilterOpen && (
              <div className="filter-dropdown">
                <button onClick={() => handleSort('createdAt', 'desc')}>
                  Latest to Oldest
                </button>
                <button onClick={() => handleSort('createdAt', 'asc')}>
                  Oldest to Latest
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="job-list">
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="no-results">No jobs found.</p>
          ) : (
            paginatedJobs.map((job) => (
              <div
                className={`job-card ${
                  selectedJob?._id === job._id ? 'selected' : ''
                }`}
                key={job._id}
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

      <div className="right-column">
        {selectedJob ? (
          <div className="job-detail">
            <h2>{selectedJob.title}</h2>
            <p className="job-meta">
              {selectedJob.company} • {selectedJob.location}
            </p>
            <p className="job-description">{selectedJob.description}</p>
            <h4>Required Skills:</h4>
            <ul className="job-skills">
              {selectedJob.requiredSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
            <button
              onClick={() =>
                navigate('/candidate-dashboard/jobs/jobapplication', { 
                  state: { job: selectedJob } 
                })
              }
              className="apply-btn"
            >
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
