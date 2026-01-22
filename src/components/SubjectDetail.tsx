'use client';

import { ArrowLeft, BookOpen, Clock, Play, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Area } from 'recharts';

interface SubjectDetailProps {
  subject: {
    id: string;
    name: string;
    progress: number;
    status: 'good' | 'on-track' | 'behind';
  };
  onBack: () => void;
}

// Mock session data
const mockSessions = [
  { id: '1', type: 'questions' as const, title: 'Review Session', subtitle: '20 questions · Today 2:00 PM' },
  { id: '2', type: 'review' as const, title: 'New Material', subtitle: '15 questions · Tomorrow 10:00 AM' },
  { id: '3', type: 'questions' as const, title: 'Review Session', subtitle: '25 questions · Jan 25 3:00 PM' },
];

// Mock weekly progress data
const mockWeeklyData = [
  { label: 'Jan 16', value: 58 },
  { label: 'Jan 17', value: 66 },
  { label: 'Jan 18', value: 63 },
  { label: 'Jan 19', value: 71 },
  { label: 'Jan 20', value: 69 },
  { label: 'Jan 21', value: 78 },
  { label: 'Jan 22', value: 85 },
];

const getIcon = (type: 'questions' | 'review' | 'video') => {
  switch (type) {
    case 'questions': return <BookOpen size={16} />;
    case 'review': return <Clock size={16} />;
    case 'video': return <Play size={16} />;
  }
};

export default function SubjectDetail({ subject, onBack }: SubjectDetailProps) {
  const chartDomain: [number, number] = [0, 100];

  return (
    <div className="home-calendar">
      <div className="home-card">
        {/* Back button */}
        <button onClick={onBack} className="subject-back-link">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Hero Title & Progress */}
        <div className="subject-hero-section">
          <h1 className="subject-hero-title">{subject.name}</h1>
          <div className="subject-hero-progress">
            <span className="subject-hero-value">{subject.progress}%</span>
            <span className="subject-hero-label">mastered</span>
          </div>
        </div>

        {/* Analytics */}
        <div className="subject-analytics">
          <div className="subject-analytics-header">
            <span className="subject-analytics-title">Jan 16–22</span>
            <span className="subject-analytics-badge">
              +{mockWeeklyData[mockWeeklyData.length - 1].value - mockWeeklyData[0].value}%
            </span>
          </div>
          <div className="subject-analytics-chart">
            <div className="subject-line-rechart">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={mockWeeklyData} margin={{ top: 10, right: 12, left: 8, bottom: 6 }}>
                  <defs>
                    <linearGradient id="subjectAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--text-secondary)" stopOpacity={0.16} />
                      <stop offset="95%" stopColor="var(--text-secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border-subtle)"
                    strokeDasharray="3 8"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                  />
                  <YAxis
                    domain={chartDomain}
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                    tickFormatter={(value) => `${value}%`}
                    width={36}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    fill="url(#subjectAreaFill)"
                    fillOpacity={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--text-secondary)"
                    strokeWidth={1.75}
                    dot={false}
                    activeDot={{ r: 3, fill: 'var(--text-secondary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="subject-upcoming-section">
          <h2 className="subject-section-title">Upcoming</h2>
          <div className="task-list">
            {mockSessions.map((session) => (
              <div key={session.id} className="task-item">
                <span className="task-check">
                  <Circle size={18} />
                </span>
                <span className="task-icon">{getIcon(session.type)}</span>
                <div className="task-text">
                  <span className="task-title">{session.title}</span>
                  <span className="task-subtitle">{session.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
