import React, { useState } from "react";
import { FaSyncAlt, FaLaptopCode, FaRobot, FaChartBar, FaChevronRight } from "react-icons/fa";

const Recommendations = () => {
  const jobs = [
    { id: 1, title: "Frontend Developer", icon: FaLaptopCode, color: "var(--accent)" },
    { id: 2, title: "Machine Learning Engineer", icon: FaRobot, color: "var(--primary)" },
    { id: 3, title: "Data Analyst", icon: FaChartBar, color: "var(--success)" },
  ];

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const viewJob = (title) => {
    alert(`Viewing job: ${title}`);
  };

  const refreshRecommendations = () => {
    alert("Refresh recommendations");
  };

  return (
    <div className="candidate-card">
      <div className="section-header">
        <h2 className="section-title">Job Recommendations</h2>
        <button className="btn btn-outline" onClick={refreshRecommendations}>
          <FaSyncAlt color="156064"/>
          Refresh
        </button>
      </div>
      <ul className="recommendations">
        {paginatedJobs.map((job) => {
          const Icon = job.icon;
          return (
            <li key={job.id} className="job-item" onClick={() => viewJob(job.title)}>
              <div className="item-content">
                <Icon style={{ color: job.color, fontSize: "1.4rem" }} />
                <span>{job.title}</span>
              </div>
              <FaChevronRight />
            </li>
          );
        })}
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
    </div>
  );
};

export default Recommendations;
