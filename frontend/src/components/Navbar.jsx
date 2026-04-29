import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">Academic Risk Intelligence</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
