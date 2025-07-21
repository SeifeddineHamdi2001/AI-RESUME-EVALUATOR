// client/src/pages/Home.jsx
import { Link, useNavigate } from 'react-router-dom';
import "../assets/styles/home.css"
import heroImg from '../assets/Pictures/Pic.png';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleBrowseJobs = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'Candidate') {
      navigate('/candidate-dashboard/jobs');
    } else if (user.role === 'Recruiter') {
      toast.error('Recruiters cannot browse jobs as candidates.');
    } else {
      toast.error('Unknown user role.');
    }
  };

  return (
    <>
      {/* Header */}
      <header>
        <Link to="/" className="logo">SkillSync</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="buttons">
          <Link to="/login" className="login">Login</Link>
          <Link to="/signup" className="register">Register</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Find Your Dream Job</h1>
          <p>Join us to connect with your future employers.</p>
          <div className="hero-buttons">
            <button type="button" className="browse" onClick={handleBrowseJobs}>Browse Jobs</button>
            <Link to="/signup" className="get-started">Get Started</Link>
          </div>
        </div>
       <div className="hero-image" style={{ backgroundImage: `url(${heroImg})` }}>
  <img src={heroImg} alt="Hero" />
</div>


  
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It works</h2>
        <p>Quickly navigate through the job market.</p>
        <div className="steps">
          <div className="step">
            <strong>Step 1</strong>
            <h4>Upload Resume</h4>
            <p>Easily upload your CV and get started.</p>
          </div>
          <div className="step">
            <strong>Step 2</strong>
            <h4>Evaluate</h4>
            <p>Get feedback on your resume quality.</p>
          </div>
          <div className="step">
            <strong>Step 3</strong>
            <h4>Apply Job</h4>
            <p>Find jobs that match your skills.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/help">Help Center</Link>
      </footer>
    </>
  );
}