import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Token available:", !!token);
        
        if (!token) {
          setError("Authentication token is missing");
          setLoading(false);
          return;
        }
        
        console.log("Making API request to fetch jobs...");
        const res = await api.get("/jobs/my-jobs");
        
        console.log("API response received:", res.status);
        console.log("Jobs data:", res.data);
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
        console.error("Error response:", error.response?.data);
        setError(error.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJobs();
    } else {
      setError("Please log in to view your jobs");
    }
  }, [token]);
  const handleEdit = (jobId) => {
    navigate(`/recruiter-dashboard/edit-job/${jobId}`);
  };

  const handleDelete = async (jobId) => {
    toast.info('Deleting a job cannot be undone. Click again to confirm.', { autoClose: 2000 });
    // Simple double-confirm: require user to click delete twice within a short time
    if (!handleDelete.lastJobId || handleDelete.lastJobId !== jobId) {
      handleDelete.lastJobId = jobId;
      handleDelete.lastTimeout = setTimeout(() => { handleDelete.lastJobId = null; }, 2000);
      return;
    }
    clearTimeout(handleDelete.lastTimeout);
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError("Authentication token is missing");
        toast.error("Authentication token is missing");
        setLoading(false);
        return;
      }
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete job");
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setLoading(false);
      handleDelete.lastJobId = null;
    }
  };
  const handleAddNew = () => {
    navigate("/recruiter-dashboard/post-job");
  };

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <button className="btn btn-primary" onClick={handleAddNew} style={{ marginBottom: "1rem" }}>
        + Add New Job
      </button>
      
      {loading && <div className="alert alert-info">Loading jobs...</div>}
      
      {/* Toasts will show errors and info, so no need for alert divs */}
      {!loading && !error && jobs.length === 0 && (
        <div className="alert alert-warning">No jobs found. Create your first job listing!</div>
      )}

      {paginatedJobs.map((job) => (
        <div key={job._id} className="job-card" style={cardStyle}>
          <h3>{job.title}</h3>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Applicants:</strong> {job.applicants ? job.applicants.length : 0}</p>
          <p><strong>Posted on:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
          <button className="btn btn-secondary" onClick={() => handleEdit(job._id)}>
            Edit Job
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete(job._id)} style={{ marginLeft: "1rem" }}>
            Delete Job
          </button>
        </div>
      ))}
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

const cardStyle = {
  border: "1px solid #ccc",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
};

export default JobManagement;