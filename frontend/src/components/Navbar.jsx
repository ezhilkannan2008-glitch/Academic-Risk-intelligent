import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { getNotifications } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch unread count on mount
  useEffect(() => {
    getNotifications('admin')
      .then(data => setUnreadCount(data.unread_count || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar glass-panel">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🔍</span>
            <span className="brand-text">Academic Risk Intelligence</span>
          </Link>
          <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notification Bell */}
            <button
              className="bell-btn"
              onClick={() => setShowNotifications(true)}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="bell-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {isAdmin ? (
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-link">Admin Login</Link>
            )}
          </div>
        </div>
      </nav>

      {showNotifications && (
        <NotificationPanel
          onClose={() => setShowNotifications(false)}
          onUnreadChange={setUnreadCount}
        />
      )}
    </>
  );
};

export default Navbar;

