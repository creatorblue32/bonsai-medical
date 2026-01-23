'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Play,
  Circle,
  CheckCircle2
} from 'lucide-react';
import BonsaiIcon from './BonsaiIcon';

// Daily study status types
type DayStatus = 'none' | 'future' | 'missed' | 'started' | 'completed';

// Static task data
const todayTasks = [
  {
    id: '1',
    type: 'questions' as const,
    title: 'Biochemistry Review',
    subtitle: '15 questions due',
    done: false,
  },
  {
    id: '2',
    type: 'review' as const,
    title: 'Amino Acids & Proteins',
    subtitle: '1 hour content review',
    done: false,
  },
  {
    id: '3',
    type: 'video' as const,
    title: 'Enzyme Kinetics',
    subtitle: 'Khan Academy · 45 min',
    done: false,
  },
  {
    id: '4',
    type: 'questions' as const,
    title: 'CARS Practice',
    subtitle: '8 passage questions',
    done: true,
  },
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Static study history data (simulated)
// Key format: "YYYY-MM-DD", value: { status }
const studyHistory: Record<string, { status: DayStatus }> = {
  // December 2025 (previous month overflow)
  '2025-12-28': { status: 'completed' },
  '2025-12-29': { status: 'completed' },
  '2025-12-30': { status: 'missed' },
  '2025-12-31': { status: 'completed' },
  // January 2026 - Full month
  '2026-01-01': { status: 'completed' },
  '2026-01-02': { status: 'completed' },
  '2026-01-03': { status: 'started' },
  '2026-01-04': { status: 'missed' },
  '2026-01-05': { status: 'completed' },
  '2026-01-06': { status: 'completed' },
  '2026-01-07': { status: 'completed' },
  '2026-01-08': { status: 'started' },
  '2026-01-09': { status: 'missed' },
  '2026-01-10': { status: 'completed' },
  '2026-01-11': { status: 'completed' },
  '2026-01-12': { status: 'completed' },
  '2026-01-13': { status: 'completed' },
  '2026-01-14': { status: 'started' },
  '2026-01-15': { status: 'completed' },
  '2026-01-16': { status: 'completed' },
  '2026-01-17': { status: 'completed' },
  '2026-01-18': { status: 'started' },
  '2026-01-19': { status: 'completed' },
  '2026-01-20': { status: 'started' }, // Today - in progress
  '2026-01-21': { status: 'future' },
  '2026-01-22': { status: 'future' },
  '2026-01-23': { status: 'future' },
  '2026-01-24': { status: 'future' },
  '2026-01-25': { status: 'future' },
  '2026-01-26': { status: 'future' },
  '2026-01-27': { status: 'future' },
  '2026-01-28': { status: 'future' },
  '2026-01-29': { status: 'future' },
  '2026-01-30': { status: 'future' },
  '2026-01-31': { status: 'future' },
  // February 2026 (next month overflow)
  '2026-02-01': { status: 'future' },
  '2026-02-02': { status: 'future' },
  '2026-02-03': { status: 'future' },
  '2026-02-04': { status: 'future' },
  '2026-02-05': { status: 'future' },
  '2026-02-06': { status: 'future' },
  '2026-02-07': { status: 'future' },
};

// Get the heatmap class based on status
function getHeatmapLevel(status: DayStatus): string {
  switch (status) {
    case 'completed': return 'heat-completed';
    case 'started': return 'heat-started';
    case 'missed': return 'heat-missed';
    case 'future': return 'heat-future';
    case 'none':
    default: return 'heat-none';
  }
}

// Format date as YYYY-MM-DD
function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function HomeCalendar() {
  const today = new Date(2026, 0, 20);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysInPrevMonth = getDaysInMonth(
    currentMonth - 1 < 0 ? 11 : currentMonth - 1, 
    currentMonth - 1 < 0 ? currentYear - 1 : currentYear
  );

  const calendarDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    heatLevel: string;
    dateKey: string;
  }> = [];
  
  // Previous month days
  const prevMonthIdx = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth - 1 < 0 ? currentYear - 1 : currentYear;
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateKey = formatDateKey(prevMonthYear, prevMonthIdx, day);
    const dayData = studyHistory[dateKey];
    calendarDays.push({ 
      day, 
      isCurrentMonth: false, 
      isToday: false,
      heatLevel: dayData ? getHeatmapLevel(dayData.status) : 'heat-none',
      dateKey
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    const dateKey = formatDateKey(currentYear, currentMonth, i);
    const dayData = studyHistory[dateKey];
    calendarDays.push({ 
      day: i, 
      isCurrentMonth: true, 
      isToday,
      heatLevel: dayData ? getHeatmapLevel(dayData.status) : 'heat-none',
      dateKey
    });
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length;
  const nextMonthIdx = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;
  for (let i = 1; i <= remainingDays; i++) {
    const dateKey = formatDateKey(nextMonthYear, nextMonthIdx, i);
    const dayData = studyHistory[dateKey];
    calendarDays.push({ 
      day: i, 
      isCurrentMonth: false, 
      isToday: false,
      heatLevel: dayData ? getHeatmapLevel(dayData.status) : 'heat-none',
      dateKey
    });
  }

  const getIcon = (type: 'questions' | 'review' | 'video') => {
    switch (type) {
      case 'questions': return <BookOpen size={16} />;
      case 'review': return <Clock size={16} />;
      case 'video': return <Play size={16} />;
    }
  };

  return (
    <div className="home-calendar">
      <div className="home-card">
        <div className="home-card-header">
          <BonsaiIcon size={36} className="welcome-icon" />
          <h1 className="welcome-heading">Welcome back, Elyas</h1>
        </div>
        
        <div className="home-card-content">
        <div className="calendar-panel">
        <div className="calendar-header">
          <h2 className="calendar-month">{MONTHS[currentMonth]} {currentYear}</h2>
          <div className="calendar-nav">
            <button onClick={prevMonth} className="nav-btn">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="nav-btn">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {DAYS.map((day, i) => (
            <div key={i} className="day-label">{day}</div>
          ))}
          
          {calendarDays.map((d, i) => (
            <div 
              key={i} 
              className={`day-cell ${d.isToday ? 'today' : ''} ${d.heatLevel}`}
              title={d.dateKey}
            >
              <span>{d.day}</span>
            </div>
          ))}
        </div>

        {/* Heatmap Legend */}
        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-square heat-completed" />
            <span className="legend-label">Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-square heat-started" />
            <span className="legend-label">Started</span>
          </div>
          <div className="legend-item">
            <div className="legend-square heat-missed" />
            <span className="legend-label">Missed</span>
          </div>
          <div className="legend-item">
            <div className="legend-square heat-future" />
            <span className="legend-label">Scheduled</span>
          </div>
        </div>
      </div>

      <div className="today-panel">
        <div className="today-header">
          <h2>Today</h2>
          <span className="today-date">{MONTHS[today.getMonth()]} {today.getDate()}</span>
        </div>

        <div className="task-list">
          {todayTasks.map(task => (
            <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <span className="task-check">
                {task.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </span>
              <span className="task-icon">{getIcon(task.type)}</span>
              <div className="task-text">
                <span className="task-title">{task.title}</span>
                <span className="task-subtitle">{task.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  </div>
  );
}
