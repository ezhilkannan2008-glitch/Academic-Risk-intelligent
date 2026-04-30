import React, { useState, useEffect, useCallback } from 'react';
import { getRiskAnalysis } from '../services/api';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRiskAnalysis();
      
      // Custom order requested by user
      const desiredOrder = [
        'multiple integral and transformer',
        'technical english',
        'quantum mechanics',
        'python programming'
      ];

      // Sort by desired order first, then by risk score
      data.sort((a, b) => {
        const nameA = a.course_name.toLowerCase();
        const nameB = b.course_name.toLowerCase();
        
        const indexA = desiredOrder.indexOf(nameA);
        const indexB = desiredOrder.indexOf(nameB);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Fallback: sort by risk score descending
        return b.risk_score - a.risk_score;
      });

      setCourses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && courses.length === 0) return <div className="loader">Loading analytics...</div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <p className="welcome-msg" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Welcome, <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{localStorage.getItem('username') || 'Jerry Davenport'}</span>
        </p>
        <h1 className="page-title">Course Risk Overview</h1>
        <p className="page-subtitle">System-level academic integrity analysis across all active courses.</p>
      </div>
      
      <div className="course-grid">
        {courses.map(course => (
          <CourseCard key={course.course_id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
