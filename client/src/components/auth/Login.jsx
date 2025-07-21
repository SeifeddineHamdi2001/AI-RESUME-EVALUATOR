import React, { useState,useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/auth.css';

const Login = () => {
  const [role, setRole] = useState('Candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'Candidate') {
        navigate('/candidate-dashboard');
      } else if (user.role === 'Recruiter') {
        navigate('/recruiter-dashboard');
      }
    }
  }, [user, navigate]);

  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful! Redirecting...');
      // Navigation is now handled in useEffect
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
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
