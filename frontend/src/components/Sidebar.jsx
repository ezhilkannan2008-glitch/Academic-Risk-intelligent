import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { getNotifications } from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    getNotifications('admin')
      .then(data => setUnreadCount(data.unread_count || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className={`sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="sidebar-brand" style={{ display: isCollapsed ? 'none' : 'flex' }}>
            <span className="brand-icon">🔍</span>
            <span className="brand-text">Academic Risk</span>
          </Link>
          <button 
            className="collapse-btn" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{ margin: isCollapsed ? '0 auto' : '0' }}
          >
            {isCollapsed ? '⏭' : '⏮'}
          </button>
        </div>

        <div className="sidebar-nav">
          <Link to="/" className={`sidebar-btn btn-purple ${isActive('/') ? 'active' : ''}`}>
            <span className="btn-icon">🎓</span>
            <span className="btn-text">Course Risk Dashboard</span>
          </Link>

          <Link to="/admin" className={`sidebar-btn btn-blue ${isActive('/admin') ? 'active' : ''}`}>
            <span className="btn-icon">🏛️</span>
            <span className="btn-text">Admin View</span>
          </Link>

          <Link to="/teacher" className={`sidebar-btn btn-green ${isActive('/teacher') ? 'active' : ''}`}>
            <span className="btn-icon">👩‍🏫</span>
            <span className="btn-text">Teacher View</span>
          </Link>

          <Link to="/student" className={`sidebar-btn btn-orange ${isActive('/student') ? 'active' : ''}`}>
            <span className="btn-icon">🧑‍🎓</span>
            <span className="btn-text">Student View</span>
          </Link>

          <button
            className={`sidebar-btn btn-grey ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(true)}
          >
            <span className="btn-icon">🔔</span>
            <span className="btn-text">Notification</span>
            {unreadCount > 0 && !isCollapsed && (
              <span className="bell-badge-sidebar">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>

          <button 
            className="sidebar-btn btn-grey"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Toggle Theme"
          >
            <span className="btn-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="btn-text">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        <div className="sidebar-footer">
          {isAdmin ? (
            <button onClick={handleLogout} className="sidebar-btn btn-blue" title="Logout">
              <span className="btn-icon">🔒</span>
              <span className="btn-text">Logout</span>
            </button>
          ) : (
            <Link to="/login" className={`sidebar-btn btn-blue ${isActive('/login') ? 'active' : ''}`} title="Login">
              <span className="btn-icon">🔓</span>
              <span className="btn-text">Login</span>
            </Link>
          )}
        </div>
      </aside>

      {showNotifications && (
        <NotificationPanel
          onClose={() => setShowNotifications(false)}
          onUnreadChange={setUnreadCount}
        />
      )}
    </>
  );
};

export default Sidebar;
