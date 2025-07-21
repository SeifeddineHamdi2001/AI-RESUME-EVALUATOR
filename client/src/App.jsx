// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import RecruiterDashboard from './components/dashboard/RecruiterDashboard';
import BrowseJobs from './components/dashboard/BrowseJobs';
import JobApplication from './pages/JobApplication';
import RecruiterProfile from './components/dashboard/RecruiterProfile';
import CandidateProfile from './components/dashboard/CandidateProfile';
import '../../client/src/App.css'; // or './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<BrowseJobs />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} />

          {/* Dashboard Pages */}
          <Route path="/candidate-dashboard/*" element={<CandidateDashboard />} />
          <Route path="/recruiter-dashboard/*" element={<RecruiterDashboard />} />

          {/* Job Application Page */}
          <Route path="/candidate-dashboard/jobs/jobapplication" element={<JobApplication />} />
          {/*/ Manage Profile Pages */}
          <Route path="/recruiter-dashboard/profile" element={<RecruiterProfile />} />
          <Route path="/candidate-dashboard/profile" element={<CandidateProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
