import React from "react";
import { FaSyncAlt, FaLaptopCode, FaRobot, FaChartBar, FaChevronRight } from "react-icons/fa";

const Recommendations = () => {
  const jobs = [
    { id: 1, title: "Frontend Developer", icon: FaLaptopCode, color: "var(--accent)" },
    { id: 2, title: "Machine Learning Engineer", icon: FaRobot, color: "var(--primary)" },
    { id: 3, title: "Data Analyst", icon: FaChartBar, color: "var(--success)" },
  ];

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
        {jobs.map((job) => {
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
    </div>
  );
};

export default Recommendations;
