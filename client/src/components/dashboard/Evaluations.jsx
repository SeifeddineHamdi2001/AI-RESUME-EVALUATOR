import React from "react";
import { FaFilter, FaFileAlt } from "react-icons/fa";

const Evaluations = () => {
  // Placeholder data
  const evaluations = [
    { id: 1, name: "resume.pdf", time: "3 hours ago", score: 85 },
    { id: 2, name: "resume_v2.pdf", time: "1 day ago", score: 65 },
    { id: 3, name: "resume_old.pdf", time: "1 week ago", score: 45 }
  ];

  const getScoreClass = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  const handleFilter = () => {
    alert("Filter evaluations");
  };

  return (
    <div className="candidate-card">
      <div className="section-header">
        <h2 className="section-title">Recent Evaluations</h2>
        <button className="btn btn-outline" onClick={handleFilter}>
          <FaFilter color="156064"/>
          Filter
        </button>
      </div>
      <ul className="evaluations">
        {evaluations.map((e) => (
          <li key={e.id} className="eval-item">
            <div className="item-content">
              <FaFileAlt />
              <span>{e.name}</span>
            </div>
            <div className="item-actions">
              <span className="timestamp">Updated: {e.time}</span>
              <span className={`score ${getScoreClass(e.score)}`} data-score={e.score}>
                {e.score}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Evaluations;
