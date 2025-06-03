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
import Applications from './components/dashboard/Applications';
import Settings from './components/dashboard/Settings';
import ResumeList from './components/dashboard/ResumeList';
import BrowseJobs from './components/dashboard/BrowseJobs';
import JobApplication from './pages/JobApplication';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
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
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

        {/* Candidate Dashboard Pages */}
        <Route path="/candidate-dashboard" element={<CandidateDashboard />}>
          <Route index element={<ResumeList />} />
          <Route path="jobs" element={<BrowseJobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/candidate-dashboard/jobs/jobapplication" element={<JobApplication />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
