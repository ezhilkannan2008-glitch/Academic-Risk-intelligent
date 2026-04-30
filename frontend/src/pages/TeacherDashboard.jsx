import React, { useState, useEffect } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ScatterTooltip, 
  BarChart, Bar, Legend, Tooltip as BarTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getTeacherAnalytics } from '../services/api';

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherAnalytics()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return <div className="loading">Analyzing Student Behavioral Data...</div>;
  if (!data) return <div className="error">Error loading analytics.</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Teacher Analytics Portal</h1>
          <p className="subtitle">Visualizing attendance, performance, and stress correlation</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>Marks vs Attendance Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" dataKey="attendance" name="Attendance %" domain={[0, 100]} stroke="var(--text-secondary)" />
              <YAxis type="number" dataKey="marks" name="Marks %" domain={[0, 100]} stroke="var(--text-secondary)" />
              <ScatterTooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                formatter={(value, name) => [`${parseFloat(value).toFixed(1)}%`, name]}
              />
              <Scatter name="Students" data={data.scatter_data} fill="var(--primary-color)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>Student Stress Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.stress_distribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis dataKey="level" type="category" stroke="var(--text-secondary)" width={80} />
              <BarTooltip />
              <Bar dataKey="students" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h3>Class Sentiment & Disciplinary Status</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Overall class health based on ML sentiment analysis of forum participation and disciplinary logs.</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data.stress_distribution} cx="50%" cy="50%" outerRadius={100} dataKey="students" nameKey="level" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {data.stress_distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <ScatterTooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeacherDashboard;
