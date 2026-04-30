import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signup(username, password);
      if (response.message) {
        // Automatically redirect to login or dashboard
        navigate('/login', { state: { message: 'Signup successful! Please login.' } });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred during signup.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-panel">
        <h2 className="login-title">Create Admin</h2>
        <p className="login-subtitle">Register a new admin account for the risk dashboard.</p>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSignup} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              autoComplete="new-password"
              required
              minLength="4"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: '#ff7300', textDecoration: 'underline' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
