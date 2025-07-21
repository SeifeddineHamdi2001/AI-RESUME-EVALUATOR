
import React, { useEffect, useRef } from "react";
import {
  FaSyncAlt,
  FaTachometerAlt,
  FaBriefcase,
  FaFileAlt,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ visible, onClose }) => {
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};

  const isRecruiter = user?.role === "Recruiter";
  const basePath = isRecruiter ? "/recruiter-dashboard" : "/candidate-dashboard";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (visible) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    onClose(); // closes sidebar on mobile
  };

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${visible ? "visible" : ""}`}
      id="sidebar"
    >
      <div className="logo">
        <FaSyncAlt />
        <span>SkillSync</span>
      </div>

      <button
        onClick={() => handleNavigate(`${basePath}`)}
        className={isActive(`${basePath}`) ? "active" : ""}
      >
        <FaTachometerAlt />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => handleNavigate(`${basePath}/jobs`)}
        className={isActive(`${basePath}/jobs`) ? "active" : ""}
      >
        <FaBriefcase />
        <span>{isRecruiter ? "Manage Jobs" : "Browse Jobs"}</span>
      </button>
      {!isRecruiter && (
  <button
    onClick={() => handleNavigate(`${basePath}/applications`)}
    className={isActive(`${basePath}/applications`) ? "active" : ""}
  >
    <FaFileAlt />
    <span>Applications</span>
  </button>
)}
      <button
        onClick={() => handleNavigate(`${basePath}/settings`)}
        className={isActive(`${basePath}/settings`) ? "active" : ""}
        style={{ marginTop: "auto" }}
      >
        <FaCog />
        <span>Settings</span>
      </button>
    </aside>
  );
};

export default Sidebar;
