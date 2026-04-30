import React, { useState, useEffect } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { getStudentProfile } from '../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo, we fetch student 1. In real app, use auth.user.id
    getStudentProfile(1)
      .then(res => {
        setProfile(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Fetching Your Academic Profile...</div>;
  if (!profile) return <div className="error">Profile not found.</div>;

  const radarData = [
    { subject: 'Marks', A: profile.total_marks, fullMark: 100 },
    { subject: 'Attendance', A: profile.attendance_pct, fullMark: 100 },
    { subject: 'Stress', A: (4 - profile.stress_level) * 25, fullMark: 100 }, // Inverting stress for radar
    { subject: 'Participation', A: profile.participation * 10, fullMark: 100 },
    { subject: 'LMS Login', A: Math.min(profile.lms_login_count, 100), fullMark: 100 },
  ];

  const historyData = [
    { sem: 'Sem 1', gpa: 8.2 },
    { sem: 'Sem 2', gpa: 7.9 },
    { sem: 'Sem 3', gpa: profile.total_marks / 10 },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Welcome, {profile.name || "Student"}</h1>
          <p className="subtitle">Your Holistic Academic Integrity & Performance Overview</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>GPA Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="sem" stroke="var(--text-secondary)" />
              <YAxis domain={[0, 10]} stroke="var(--text-secondary)" />
              <Tooltip />
              <Area type="monotone" dataKey="gpa" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Profile Strength (ML Analysis)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Student" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>ML Prediction & Status</h3>
          <div style={{ padding: '1rem', borderRadius: '12px', background: profile.predicted_risk ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${profile.predicted_risk ? '#ef4444' : '#10b981'}` }}>
            <h4 style={{ color: profile.predicted_risk ? '#ef4444' : '#10b981', marginBottom: '0.5rem' }}>
              {profile.predicted_risk ? '⚠️ At Risk Flagged' : '✅ Academic Standing: Safe'}
            </h4>
            <p style={{ fontSize: '0.9rem' }}>
              Our ML model has analyzed your attendance ({profile.attendance_pct}%), stress level, and submission patterns.
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>Intelligent Suggestions</h3>
          <div style={{ fontStyle: 'italic', color: 'var(--text-primary)', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>
            "{profile.suggestion || "Keep up the consistent performance! Ensure your assignment submission rate stays above 90% to maintain your current grade trajectory."}"
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
