import React, { useEffect, useRef } from "react";
import {
  FaSyncAlt,
  FaTachometerAlt,
  FaBriefcase,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ visible, onClose }) => {
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    onClose(); // Optional: closes sidebar on mobile after nav
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
        onClick={() => handleNavigate("/candidate-dashboard")}
        className={isActive("/candidate-dashboard") ? "active" : ""}
      >
        <FaTachometerAlt />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => handleNavigate("/candidate-dashboard/jobs")}
        className={isActive("/candidate-dashboard/jobs") ? "active" : ""}
      >
        <FaBriefcase />
        <span>Browse Jobs</span>
      </button>

      <button
        onClick={() => handleNavigate("/candidate-dashboard/applications")}
        className={isActive("/candidate-dashboard/applications") ? "active" : ""}
      >
        <FaFileAlt />
        <span>Applications</span>
      </button>

      <button
        onClick={() => handleNavigate("/candidate-dashboard/settings")}
        className={isActive("/candidate-dashboard/settings") ? "active" : ""}
        style={{ marginTop: "auto" }}
      >
        <FaCog />
        <span>Settings</span>
      </button>

      <style>
{`
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    background-color: var(--dark); /* Adjust as needed */
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    z-index: 1000;
    box-sizing: border-box;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
  }

  .sidebar.visible {
    transform: translateX(0);
  }

  .sidebar button {
    all: unset;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 10px 15px;
    cursor: pointer;
    color: white;
    font-size: 0.95rem;
    width: calc(100% - 30px); /* Prevent overflow */
    border-radius: 8px;
    box-sizing: border-box;
  }

  .sidebar button.active {
    background: var(--primary, #4ecca3);
    color: white;
    font-weight: bold;
  }

  .sidebar button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 2rem;
    padding: 0 15px;
  }
`}
</style>

    </aside>
  );
};

export default Sidebar;
