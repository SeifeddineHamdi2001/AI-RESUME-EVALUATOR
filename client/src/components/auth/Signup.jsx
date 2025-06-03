import React, { useState } from 'react';
import 'D:/ai-resume-evaluator/client/src/assets/styles/auth.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const strengthCalc = Math.min((val.length / 12) * 100, 100);
    setStrength(strengthCalc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role.charAt(0).toUpperCase() + role.slice(1) // "Candidate" / "Recruiter"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed');
      } else {
        setSuccess('Account created successfully!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <div className="password-strength">
            <div
              className="strength-bar"
              style={{
                width: `${strength}%`,
                background:
                  strength < 40
                    ? '#E53E3E'
                    : strength < 70
                    ? '#F0A202'
                    : '#156064',
              }}
            ></div>
          </div>
        </div>

        <div className="form-group">
          <label>You are:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="candidate"
                checked={role === 'candidate'}
                onChange={() => setRole('candidate')}
              />
              Candidate
            </label>
            <label>
              <input
                type="radio"
                value="recruiter"
                checked={role === 'recruiter'}
                onChange={() => setRole('recruiter')}
              />
              Recruiter
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Account</button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </form>

      <div className="auth-link">
        Already have an account?{' '}
        <span className="link-green" onClick={() => navigate('/login')}>
          Login
        </span>
      </div>
    </div>
  );
};

export default Signup;
