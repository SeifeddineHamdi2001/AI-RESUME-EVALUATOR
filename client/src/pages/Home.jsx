// client/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import "../assets/styles/home.css"

export default function Home() {
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
            <Link to="/jobs" className="browse">Browse Jobs</Link>
            <Link to="/signup" className="get-started">Get Started</Link>
          </div>
        </div>
        <div className="hero-image"></div>
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