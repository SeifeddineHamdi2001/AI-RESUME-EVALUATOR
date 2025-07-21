import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ResumeList from "./ResumeList";
import Evaluations from "./Evaluations";
import Recommendations from "./Recommendations";
import Applications from "./Applications";
import Settings from "./Settings";
import BrowseJobs from "./BrowseJobs";

import "../../assets/styles/Dashboard.css"; // Fixed import path
import { AuthContext } from "../../context/AuthContext";

const CandidateDashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  const routeTitles = {
    "/candidate-dashboard": "Candidate Dashboard",
    "/candidate-dashboard/jobs": "Job Browser",
    "/candidate-dashboard/applications": "Applications",
    "/candidate-dashboard/settings": "Settings",
  };

  return (
    <div className="candidate-dashboard-wrapper">
      <Sidebar
        visible={isSidebarVisible}
        onClose={closeSidebar}
        role="Candidate"
      />
      <Topbar
        toggleSidebar={toggleSidebar}
        title={routeTitles[location.pathname] || "Candidate Dashboard"}
      />

      <main
        className={`dashboard-layout ${
          isSidebarVisible ? "with-sidebar" : "full"
        }`}
        id="mainContent"
      >
        <Routes>
          <Route
            index
            element={
              <>
                <section className="candidate-dashboard-section">
                  <h2>Your Resumes</h2>
                  <ResumeList />
                </section>
                <section className="candidate-dashboard-section">
                  <h2>Evaluation Results</h2>
                  <Evaluations />
                </section>
                <section className="candidate-dashboard-section">
                  <h2>Job Recommendations</h2>
                  <Recommendations />
                </section>
              </>
            }
          />
          <Route
            path="jobs"
            element={
              <section className="candidate-dashboard-section">
                <h2>Browse Jobs</h2>
                <BrowseJobs />
              </section>
            }
          />
          <Route
            path="applications"
            element={
              <section className="candidate-dashboard-section">
                <h2>Your Applications</h2>
                <Applications />
              </section>
            }
          />
          <Route
            path="settings"
            element={
              <section className="candidate-dashboard-section">
                <h2>Settings</h2>
                <Settings />
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default CandidateDashboard;
