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
      
      <p className="course-explanation">{course.explanation}</p>
      
      <div className="course-card-footer">
        View Analytics <span className="arrow">→</span>
      </div>
    </Link>
  );
};

export default CourseCard;
