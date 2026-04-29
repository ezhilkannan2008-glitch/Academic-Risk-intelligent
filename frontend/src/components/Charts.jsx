import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

export const ScoreHistogram = ({ data }) => {
  // data is array of bin counts: [0-10, 10-20, ..., 90-100]
  const chartData = data.map((count, i) => ({
    range: `${i * 10}-${(i + 1) * 10}`,
    count: count
  }));

  return (
    <div className="chart-container glass-panel">
      <h3 className="chart-title">Score Distribution</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="range" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
            <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--primary-color)' }}
              cursor={{fill: 'var(--hover-bg)'}}
            />
            <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TimelineChart = ({ data }) => {
  // Process timeline data by day
  const dailyCounts = {};
  data.forEach(item => {
    const date = item.timestamp.split(' ')[0];
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });
  
  const chartData = Object.keys(dailyCounts).sort().map(date => ({
    date: date.substring(5), // MM-DD
    submissions: dailyCounts[date]
  }));

  return (
    <div className="chart-container glass-panel">
      <h3 className="chart-title">Submission Timeline</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
            <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--accent-color)' }}
            />
            <Line type="monotone" dataKey="submissions" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-color)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
