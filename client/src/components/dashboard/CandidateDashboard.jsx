import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ResumeList from "./ResumeList";
import Evaluations from "./Evaluations";
import Recommendations from "./Recommendations";
import Applications from "./Applications";
import Settings from "./Settings";

import "d:/ai-resume-evaluator/client/src/assets/styles/Dashboard.css";

import BrowseJobs from "./BrowseJobs";

const CandidateDashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);

  // Determine title dynamically (optional improvement)
  const routeTitles = {
    "/candidate-dashboard": "Candidate Dashboard",
    "/candidate-dashboard/jobs": "Job Browser",
    "/candidate-dashboard/applications": "Applications",
    "/candidate-dashboard/settings": "Settings",
  };

  return (
    <div className="candidate-dashboard-wrapper">
      <Sidebar visible={isSidebarVisible} onClose={closeSidebar} role="Candidate" />
      <Topbar toggleSidebar={toggleSidebar} title={routeTitles[location.pathname] || "Candidate Dashboard"} />

      <main className={`candidate-main ${isSidebarVisible ? "with-sidebar" : "full"}`} id="mainContent">
        <Routes>
          <Route
            path="/"
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
            path="/jobs"
            element={
              <section className="candidate-dashboard-section">
                <h2>Browse Jobs</h2>
                <BrowseJobs />
              </section>
            }
          />
          <Route
            path="/applications"
            element={
              <section className="candidate-dashboard-section">
                <h2>Your Applications</h2>
                <Applications />
              </section>
            }
          />
          <Route
            path="/settings"
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
