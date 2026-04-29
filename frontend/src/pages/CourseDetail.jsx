import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetail } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import { ScoreHistogram, TimelineChart } from '../components/Charts';

const CourseDetail = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourseDetail(id);
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loader">Analyzing course data...</div>;
  if (!courseData) return <div className="error">Course not found.</div>;

  const { course_name, analytics, risk, recommendations, timeline_data } = courseData;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      
      <div className="detail-header glass-panel">
        <div className="detail-header-main">
          <h1 className="page-title">{course_name}</h1>
          {risk && <RiskBadge level={risk.risk_level} score={risk.risk_score} />}
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{analytics.avg_score}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Standard Deviation</span>
            <span className="stat-value">{analytics.std_dev}</span>
          </div>
        </div>
      </div>

      <div className="detail-content grid-layout">
        <div className="main-column">
          <ScoreHistogram data={analytics.score_histogram} />
          <TimelineChart data={timeline_data} />
        </div>
        
        <div className="side-column">
          {risk && (
            <div className="info-panel glass-panel">
              <h3>Risk Explanation</h3>
              <p className="explanation-text">{risk.explanation}</p>
              
              {risk.flags && risk.flags.length > 0 && (
                <div className="flags-list">
                  <h4>Detected Anomalies:</h4>
                  <ul>
                    {risk.flags.map((flag, idx) => (
                      <li key={idx}><span className="flag-tag">{flag}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="info-panel glass-panel recommendation-panel">
            <h3>Recommendations</h3>
            <ul className="recommendation-list">
              {recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
