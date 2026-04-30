import React from 'react';
import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course.course_id}`} className="course-card glass-panel">
      <div className="course-card-header">
        <h3 className="course-title">{course.course_name}</h3>
        <RiskBadge level={course.risk_level} score={course.risk_score} />
      </div>
      
      {course.flags && course.flags.length > 0 && (
        <div className="course-flags">
          {course.flags.map((flag, idx) => (
            <span key={idx} className="flag-tag">{flag}</span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
        <div className="full-width-btn" style={{ 
          width: '100%', 
          padding: '1.25rem', 
          background: 'var(--primary-color)', 
          color: 'white', 
          borderRadius: '8px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '700',
          fontSize: '1.1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease'
        }}>
          View Analytics <span className="arrow" style={{ transform: 'rotate(-45deg)', display: 'inline-block', fontSize: '1.2rem' }}>➔</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
