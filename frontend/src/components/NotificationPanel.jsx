import React, { useState, useEffect } from 'react';
import {
  getNotifications,
  generateNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../services/api';

const TYPE_CONFIG = {
  alert:    { icon: '🔴', label: 'Alert',     color: 'var(--danger-color)',  bg: 'rgba(220,38,38,0.07)'  },
  warning:  { icon: '🟡', label: 'Warning',   color: 'var(--warning-color)', bg: 'rgba(217,119,6,0.07)'  },
  reminder: { icon: '🟢', label: 'Reminder',  color: 'var(--success-color)', bg: 'rgba(5,150,105,0.07)'  },
  info:     { icon: '🔵', label: 'Info',      color: 'var(--primary-color)', bg: 'rgba(37,99,235,0.07)'  },
};

const ROLES = ['admin', 'faculty'];

const NotificationPanel = ({ onClose, onUnreadChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState('admin');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications(role);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
      if (onUnreadChange) onUnreadChange(data.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [role]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateNotifications();
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to generate notifications', err);
    }
    setGenerating(false);
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
    );
    const newCount = Math.max(0, unreadCount - 1);
    setUnreadCount(newCount);
    if (onUnreadChange) onUnreadChange(newCount);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(role);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    setUnreadCount(0);
    if (onUnreadChange) onUnreadChange(0);
  };

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-panel glass-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="notif-header">
          <div className="notif-header-top">
            <h3 className="notif-title">🔔 Notifications</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          {/* Role Selector */}
          <div className="notif-role-tabs">
            {ROLES.map(r => (
              <button
                key={r}
                className={`notif-role-tab ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="notif-filters">
            {['all', 'alert', 'warning', 'reminder', 'info'].map(f => (
              <button
                key={f}
                className={`notif-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : TYPE_CONFIG[f].icon + ' ' + TYPE_CONFIG[f].label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="notif-actions">
            <button className="notif-action-btn generate-btn" onClick={handleGenerate} disabled={generating}>
              {generating ? '⟳ Generating...' : '⟳ Refresh Alerts'}
            </button>
            {unreadCount > 0 && (
              <button className="notif-action-btn read-all-btn" onClick={handleMarkAllRead}>
                ✓ Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="notif-list">
          {loading ? (
            <div className="notif-empty">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="notif-empty">
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <p>No notifications for this filter.</p>
              <button className="notif-action-btn generate-btn" onClick={handleGenerate}>
                Generate Alerts
              </button>
            </div>
          ) : (
            filtered.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              return (
                <div
                  key={n.id}
                  className={`notif-item ${n.is_read ? 'read' : 'unread'}`}
                  style={{ borderLeftColor: cfg.color, background: n.is_read ? 'transparent' : cfg.bg }}
                >
                  <div className="notif-item-header">
                    <span className="notif-type-badge" style={{ color: cfg.color }}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <span className="notif-time">{formatDate(n.created_at)}</span>
                  </div>
                  <p className="notif-item-title">{n.title}</p>
                  <p className="notif-item-msg">{n.message}</p>
                  {!n.is_read && (
                    <button
                      className="notif-mark-read"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
