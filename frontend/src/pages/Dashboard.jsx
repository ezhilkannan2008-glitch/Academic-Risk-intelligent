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
      // Sort by risk score descending
      data.sort((a, b) => b.risk_score - a.risk_score);
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
