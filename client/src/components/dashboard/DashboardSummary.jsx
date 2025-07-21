import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/styles/DashboardSummary.css";
import { FaFilePdf } from "react-icons/fa";

const DashboardSummary = () => {
  const [jobs, setJobs] = useState([]);
  const [openJobs, setOpenJobs] = useState({});
  const [jobSort, setJobSort] = useState({}); // { [jobId]: { sortBy, sortOrder } }
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const [jobsRes, applicationsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/jobs/my-jobs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/applications/recruiter", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const jobsData = jobsRes.data;
        const applicationsData = applicationsRes.data;

        // Group applications by job
        const jobsWithApplicants = jobsData.map((job) => ({
          ...job,
          applicants: applicationsData
            .filter((app) => app.job._id === job._id)
        }));

        setJobs(jobsWithApplicants);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (token) {
      fetchJobsAndApplications();
    }
  }, [token]);

  const toggleJob = (id) => {
    setOpenJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateApplicantStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          applicants: job.applicants.map((applicant) =>
            applicant._id === applicationId
              ? { ...applicant, status: newStatus }
              : applicant
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Sorting logic
  const sortApplicants = (applicants, jobId) => {
    const sortBy = jobSort[jobId]?.sortBy || "score";
    const sortOrder = jobSort[jobId]?.sortOrder || "desc";
    let sorted = [...applicants];
    if (sortBy === "score") {
      sorted.sort((a, b) => {
        const aScore = a.evaluation?.score ?? -1;
        const bScore = b.evaluation?.score ?? -1;
        return sortOrder === "desc" ? bScore - aScore : aScore - bScore;
      });
    } else if (sortBy === "date") {
      sorted.sort((a, b) => {
        const aDate = new Date(a.applicationDate);
        const bDate = new Date(b.applicationDate);
        return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
      });
    }
    return sorted;
  };

  const handleSortChange = (jobId, field, value) => {
    setJobSort((prev) => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [field]: value,
      },
    }));
  };

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState({});
  const getTotalPages = (job) => Math.ceil(job.applicants.length / ITEMS_PER_PAGE);
  const getPaginatedApplicants = (job) => job.applicants.slice(((currentPage[job._id] || 1) - 1) * ITEMS_PER_PAGE, (currentPage[job._id] || 1) * ITEMS_PER_PAGE);
  const setJobPage = (jobId, page) => setCurrentPage((prev) => ({ ...prev, [jobId]: page }));

  return (
    <div>
      {jobs.map((job) => (
        <div key={job._id} className="job-summary-card" style={styles.card}>
          <h2>{job.title}</h2>
          <p>{job.description}</p>
          <p>
            Number of applicants: <strong>{job.applicants.length}</strong>
          </p>
          {/* Per-job sort filter */}
          <div style={{ marginBottom: 12 }}>
            <label>Sort by: </label>
            <select
              value={jobSort[job._id]?.sortBy || "score"}
              onChange={e => handleSortChange(job._id, "sortBy", e.target.value)}
            >
              <option value="score">Score</option>
              <option value="date">Application Date</option>
            </select>
            <button
              onClick={() => handleSortChange(job._id, "sortOrder", (jobSort[job._id]?.sortOrder || "desc") === "desc" ? "asc" : "desc")}
              style={{ marginLeft: 8 }}
            >
              {(jobSort[job._id]?.sortOrder || "desc") === "desc" ? "▼" : "▲"}
            </button>
          </div>
          <button
            className={`dashboard-toggle-btn ${openJobs[job._id] ? "hide-applicants" : "view-applicants"}`}
            onClick={() => toggleJob(job._id)}
          >
            {openJobs[job._id] ? "Hide Applicants" : "View Applicants"}
          </button>
          {openJobs[job._id] && (
            <div className="applicants-list" style={styles.applicantsList}>
              {job.applicants.length === 0 ? (
                <p>No applicants yet.</p>
              ) : (
                getPaginatedApplicants(job).map((applicant) => (
                  <div
                    key={applicant._id}
                    className="applicant-item"
                    style={styles.applicantItem}
                  >
                    <div className="applicant-info">
                      <p>
                        <strong>{applicant.candidate.name}</strong>
                      </p>
                      <div className={`status-badge ${applicant.status}`}>
                        {applicant.status}
                      </div>
                      {applicant.evaluation && (
                        <div className="ai-eval">
                          <div><strong>AI Score:</strong> {applicant.evaluation.score ?? 'N/A'}</div>
                          <div><strong>AI Feedback:</strong> {Array.isArray(applicant.evaluation.suggestions) ? applicant.evaluation.suggestions.join(', ') : applicant.evaluation.suggestions ?? 'N/A'}</div>
                        </div>
                      )}
                    </div>
                    <div className="applicant-actions">
                      <div className="decision-buttons">
                        <button
                          className={`action-btn ${
                            applicant.status === "Accepted"
                              ? "accept-btn"
                              : "decision-btn-default"
                          }`}
                          onClick={() => updateApplicantStatus(applicant._id, "Accepted")}
                          disabled={applicant.status === "Accepted"}
                        >
                          Accept
                        </button>
                        <button
                          className={`action-btn ${
                            applicant.status === "Rejected"
                              ? "reject-btn"
                              : "decision-btn-default"
                          }`}
                          onClick={() => updateApplicantStatus(applicant._id, "Rejected")}
                          disabled={applicant.status === "Rejected"}
                        >
                          Reject
                        </button>
                        {applicant.resume?.filePath && (
                          <a
                            href={`http://localhost:5000/uploads/resumes/${applicant.resume.filePath.split(/resumes[\\/]/).pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ marginLeft: 8 }}
                          >
                            <FaFilePdf style={{ fontSize: '1.1em' }} />
                            View Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* Pagination Controls */}
              {getTotalPages(job) > 1 && (
                <div className="pagination-controls">
                  <button onClick={() => setJobPage(job._id, Math.max(1, (currentPage[job._id] || 1) - 1))} disabled={(currentPage[job._id] || 1) === 1}>&laquo;</button>
                  {Array.from({ length: getTotalPages(job) }, (_, i) => (
                    <button
                      key={i + 1}
                      className={(currentPage[job._id] || 1) === i + 1 ? 'active' : ''}
                      onClick={() => setJobPage(job._id, i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setJobPage(job._id, Math.min(getTotalPages(job), (currentPage[job._id] || 1) + 1))} disabled={(currentPage[job._id] || 1) === getTotalPages(job)}>&raquo;</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #e0e0e0",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  applicantsList: {
    marginTop: "15px",
    paddingLeft: "15px",
    borderLeft: "3px solid #e0e0e0",
  },
  applicantItem: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default DashboardSummary;
