import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import 'D:/ai-resume-evaluator/client/src/assets/styles/auth.css';

const Login = () => {
  const [role, setRole] = useState('Candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning('Please fill in both fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      login(data.user); // Save user in context/localStorage

      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        if (data.user.role === 'candidate') {
          navigate('/candidate-dashboard');
        } else {
          navigate('/recruiter-dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>

      <div className="role-toggle">
        <button
          className={role === 'candidate' ? 'active' : ''}
          onClick={() => handleRoleClick('candidate')}
        >
          Candidate
        </button>
        <button
          className={role === 'recruiter' ? 'active' : ''}
          onClick={() => handleRoleClick('recruiter')}
        >
          Recruiter
        </button>
      </div>

      <form onSubmit={handleSubmit}>
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Sign In</button>
      </form>

      <div className="auth-link">
        Don’t have an account?{' '}
        <span className="link-green" onClick={() => navigate('/signup')}>
          Sign up
        </span>
      </div>
    </div>
  );
};

export default Login;
