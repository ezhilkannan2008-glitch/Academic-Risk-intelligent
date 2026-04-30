import React from 'react';

const RiskBadge = ({ level, score }) => {
  const colors = {
    Low: 'var(--success-color)',
    Medium: 'var(--warning-color)',
    High: 'var(--danger-color)'
  };
  
  const bgColor = colors[level] || 'var(--text-secondary)';
  
  if (level === 'High') {
    return (
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        border: `1px solid ${bgColor}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.9rem',
        fontWeight: '800',
        color: bgColor,
        backgroundColor: 'var(--bg-badge)',
        lineHeight: '1.2',
        flexShrink: 0
      }}>
        <span>High</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div className="risk-badge-dot" style={{ backgroundColor: bgColor, width: '6px', height: '6px', borderRadius: '50%' }}></div>
          <span>Risk</span>
        </div>
        <span>({score})</span>
      </div>
    );
  }

  return (
    <div className="risk-badge" style={{ borderColor: bgColor, color: bgColor }}>
      <div className="risk-badge-dot" style={{ backgroundColor: bgColor }}></div>
      <span className="risk-badge-text">{level} Risk ({score})</span>
    </div>
  );
};

export default RiskBadge;
