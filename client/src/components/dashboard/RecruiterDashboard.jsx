import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar"; // Your recruiter-specific sidebar
import Topbar from "./Topbar";
import JobManagement from "./JobManagement";
import RecruiterSettings from "./Settings";
import PostJobForm from "./PostJobForm";
import DashboardSummary from "./DashboardSummary";

import "../../assets/styles/Dashboard.css"; // Adjust path if needed
import { AuthContext } from "../../context/AuthContext";

const RecruiterDashboard = () => {
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

  // Page titles by route
  const routeTitles = {
    "/recruiter-dashboard": "Recruiter Dashboard",
    "/recruiter-dashboard/jobs": "Manage Jobs",
    "/recruiter-dashboard/applicants": "Applicants",
    "/recruiter-dashboard/settings": "Settings",
  };

  return (
    <div className="candidate-dashboard-wrapper">
      <Sidebar visible={isSidebarVisible} onClose={closeSidebar} role="Recruiter" />
      <Topbar toggleSidebar={toggleSidebar} title={routeTitles[location.pathname] || "Recruiter Dashboard"} />

      <main className={`dashboard-layout ${isSidebarVisible ? "with-sidebar" : "full"}`} id="mainContent">
        <Routes>
  <Route
    path="/"
    element={
      <>
        <section className="candidate-dashboard-section">
          <h2>Welcome, Recruiter!</h2>
          <p>Manage your job posts and track applicants from here.</p>
          <DashboardSummary />
        </section>
      </>
    }
  />
  <Route
    path="jobs"
    element={
      <section className="candidate-dashboard-section">
        <h2>Manage Jobs</h2>
        <JobManagement />
      </section>
    }
  />
  <Route
    path="post-job"
    element={
      <section className="candidate-dashboard-section">
        <PostJobForm/>
      </section>
    }
  />
  <Route
    path="edit-job/:jobId"
    element={
      <section className="candidate-dashboard-section">
        <PostJobForm />
      </section>
    }
  />
  <Route
    path="settings"
    element={
      <section className="candidate-dashboard-section">
        <h2>Settings</h2>
        <RecruiterSettings />
      </section>
    }
  />
</Routes>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
