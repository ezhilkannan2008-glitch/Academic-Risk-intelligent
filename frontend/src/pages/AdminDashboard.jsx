import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, 
  AreaChart, Area, ResponsiveContainer 
} from 'recharts';
import { getAdminAnalytics } from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const COLORS = ['#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

  if (loading) return <div className="loading">Loading Real-Time Analytics...</div>;
  if (!data) return <div className="error">Error loading data.</div>;

  const feesChartData = [
    { name: 'Fees Collected', value: data.total_fees },
    { name: 'Scholarships', value: data.total_scholarships },
    { name: 'Remaining', value: Math.max(0, (data.total_students * 150000) - data.total_fees) }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <p className="welcome-msg" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            Welcome, <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{localStorage.getItem('username') || 'Jerry Davenport'}</span>
          </p>
          <h1>Admin Power Dashboard</h1>
          <p className="subtitle">Real-time metrics from Student database</p>
        </div>
      </header>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Active Students</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>{data.total_students.toLocaleString()}</div>
        </div>
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>At-Risk Students</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger-color)' }}>
            {data.risk_distribution.find(r => r.name === 'At Risk')?.count || 0}
          </div>
        </div>
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>University Fee Collection</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success-color)' }}>
            ₹{(data.total_fees / 10000000).toFixed(2)} Cr
          </div>
        </div>
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Scholarships Disbursed</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-color)' }}>
            ₹{(data.total_scholarships / 10000000).toFixed(2)} Cr
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>Financial Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={feesChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {feesChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <PieTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3>Risk Prediction Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.risk_distribution} margin={{ bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" interval={0} />
              <YAxis stroke="var(--text-secondary)" />
              <BarTooltip />
              <Legend />
              <Bar dataKey="count" name="Student Count" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>
                {data.risk_distribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'At Risk' ? 'var(--danger-color)' : 'var(--success-color)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h3>University Attendance Trends (Last 5 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.attendance_trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis domain={[0, 100]} stroke="var(--text-secondary)" />
            <BarTooltip />
            <Area type="monotone" dataKey="avgAttendance" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.2} name="Average Attendance %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
