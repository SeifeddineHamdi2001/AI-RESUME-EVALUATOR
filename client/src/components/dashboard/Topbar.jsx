import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const routeTitles = {
    "/candidate-dashboard": "Dashboard",
    "/candidate-dashboard/jobs": "Job Browser",
    "/candidate-dashboard/applications": "Job Applications",
    "/candidate-dashboard/profile": "Profile",

    "/recruiter-dashboard": "Dashboard",
    "/recruiter-dashboard/jobs": "Job Management",
    "/recruiter-dashboard/applicants": "Applicants",
    "/recruiter-dashboard/settings": "Settings",
  };

  const currentPath = location.pathname;
  const roleTitle = user?.role === 'Recruiter' ? "Recruiter" : "Candidate";
  const pageTitle = routeTitles[currentPath] || "Dashboard";

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleProfileClick = () => {
    navigate("/candidate-dashboard/profile");
    setDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    navigate("/")
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar">
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className="title">{`${roleTitle} · ${pageTitle}`}</div>

      <div className="profile" ref={dropdownRef}>
        <div className="profile-img" onClick={toggleDropdown}>
          {user?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <span>Welcome, {user?.name || "Guest"}</span>

        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={handleProfileClick}>Manage Profile</button>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        )}
      </div>

      <style>{`
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background-color: var(--dark);
    color: white;
    position: relative;
    z-index: 5;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .toggle-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: white;
    cursor: pointer;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .profile {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .profile-img {
    background: var(--primary);
    color: white;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: bold;
    cursor: pointer;
  }

  .welcome-text {
    font-size: 0.9rem;
    color: white;
  }

  .dropdown {
    position: absolute;
    min-width: 140px; /* smaller fixed width, matches topbar */
    top: 48px;
    padding: 4px 0; /* slightly tighter padding */
    right: 0;
    background: var(--dark);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    min-width: 180px;
    padding: 6px 0;
    z-index: 1000;
  }

  .dropdown button {
    all: unset;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    width: 100%;
    font-size: 0.95rem;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
     box-sizing: border-box; /* ensure padding is included in width */
    text-align: left;
  }

  .dropdown button:hover {
    background-color: var(--primary);
  }
`}</style>

    </div>
  );
};

export default Topbar;
