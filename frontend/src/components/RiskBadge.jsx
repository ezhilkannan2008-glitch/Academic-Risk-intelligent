import React from 'react';

const RiskBadge = ({ level, score }) => {
  const colors = {
    Low: 'var(--success-color)',
    Medium: 'var(--warning-color)',
    High: 'var(--danger-color)'
  };
  
  const bgColor = colors[level] || 'var(--text-secondary)';
  
  return (
    <div className="risk-badge" style={{ borderColor: bgColor, color: bgColor }}>
      <div className="risk-badge-dot" style={{ backgroundColor: bgColor }}></div>
      <span className="risk-badge-text">{level} Risk ({score})</span>
    </div>
  );
};

export default RiskBadge;
