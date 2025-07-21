import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostJobForm = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    requiredSkills: [],
    company: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${jobId}`);
          setFormData(res.data);
        } catch (error) {
          console.error("Error fetching job data", error);
        }
      };
      fetchJob();
    }
  }, [jobId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (currentSkill.trim() && !formData.requiredSkills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (jobId) {
        await api.put(`/jobs/${jobId}`, formData);
        toast.success("Job updated successfully!");
      } else {
        await api.post("/jobs", formData);
        toast.success("Job posted successfully!");
      }
      navigate("/recruiter-dashboard/jobs");
    } catch (error) {
      console.error("Error saving job", error);
      toast.error("Failed to save job.");
    }
  };

  return (
    <div className="job-form-container">
      <h1>{jobId ? "Edit Job" : "Post a New Job"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="e.g. Tech Solutions Inc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe the job responsibilities and requirements"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Remote, Tunis"
          />
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          <div className="skills-input-container">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              placeholder="Add required skills (e.g. React, Python)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSkillAdd();
                }
              }}
            />
            <button
              type="button"
              className="add-skill-btn"
              onClick={handleSkillAdd}
            >
              Add Skill
            </button>
          </div>
          <div className="skills-tags">
            {formData.requiredSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button
                  type="button"
                  className="remove-skill-btn"
                  onClick={() => handleSkillRemove(skill)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {jobId ? "Update Job" : "Post Job"}
        </button>
      </form>

      <style jsx>{`
        .job-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          text-align: center;
          margin-bottom: 2rem;
          color: #2d3748;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #4a5568;
        }
        
        input[type="text"],
        textarea,
        select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        input[type="text"]:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }
        
        textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .skills-input-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .skills-input-container input {
          flex: 1;
        }
        
        .add-skill-btn {
          padding: 0 1rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .add-skill-btn:hover {
          background: #3182ce;
        }
        
        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .skill-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          background: #ebf8ff;
          color: #2b6cb0;
          border-radius: 9999px;
          font-size: 0.875rem;
        }
        
        .remove-skill-btn {
          margin-left: 0.5rem;
          background: none;
          border: none;
          color: #2b6cb0;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
        }
        
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: #48bb78;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }
        
        .submit-btn:hover {
          background: #38a169;
        }
      `}</style>
    </div>
  );
};

export default PostJobForm;