import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetail } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import { ScoreHistogram, TimelineChart } from '../components/Charts';
import AddDataModal from '../components/AddDataModal';

const CourseDetail = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCourseDetail(id);
      setCourseData(data);
    } catch (error) {
      console.error("Error fetching course detail:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !courseData) return <div className="loader">Analyzing course data...</div>;
  if (!courseData) return <div className="error">Course not found.</div>;

  const { course_name, analytics, risk, recommendations, timeline_data } = courseData;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      
      <div className="detail-header glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div className="detail-header-main">
            <h1 className="page-title">{course_name}</h1>
            {risk && <RiskBadge level={risk.risk_level} score={risk.risk_score} />}
          </div>
          <button 
            className="login-button" 
            style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}
            onClick={() => setIsModalOpen(true)}
          >
            + Add Data
          </button>
        </div>
        <div className="stats-row" style={{ marginTop: '1.5rem' }}>
          <div className="stat-card">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">
              {analytics.avg_score}
              <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: analytics.avg_score_change >= 0 ? '#4caf50' : '#f44336' }}>
                ({analytics.avg_score_change > 0 ? '+' : ''}{analytics.avg_score_change || 0}) change
              </span>
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Standard Deviation</span>
            <span className="stat-value">
              {analytics.std_dev}
              <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: analytics.std_dev_change >= 0 ? '#4caf50' : '#f44336' }}>
                ({analytics.std_dev_change > 0 ? '+' : ''}{analytics.std_dev_change || 0}) change
              </span>
            </span>
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

      <AddDataModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onDataAdded={fetchData} 
      />
    </div>
  );
};

export default CourseDetail;
