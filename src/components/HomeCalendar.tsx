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

// Days with scheduled items (static)
const scheduledDays = new Set([15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);

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

  const calendarDays = [];
  
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isToday: false });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    calendarDays.push({ day: i, isCurrentMonth: true, isToday });
  }
  
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false, isToday: false });
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
              className={`day-cell ${!d.isCurrentMonth ? 'muted' : ''} ${d.isToday ? 'today' : ''}`}
            >
              <span>{d.day}</span>
              {d.isCurrentMonth && scheduledDays.has(d.day) && !d.isToday && (
                <span className="day-dot" />
              )}
            </div>
          ))}
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
