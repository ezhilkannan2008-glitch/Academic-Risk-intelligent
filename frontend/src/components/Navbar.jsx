import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          <span className="brand-text">Academic Risk Intelligence</span>
        </Link>
        <div className="navbar-links">
          {isAdmin ? (
            <>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Admin Login</Link>
          )}        </div>
      </div>
    </nav>
  );
};

export default Navbar;
