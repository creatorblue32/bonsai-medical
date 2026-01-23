'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown, X, Home, LineChart, Settings, CalendarCog, BookOpen, User } from 'lucide-react';
import BonsaiIcon from './BonsaiIcon';
import { StudyStore } from '@/lib/studyStore';

type Exam = {
  id: string;
  name: string;
};

const exams: Exam[] = [
  { id: 'step1', name: 'USMLE® Step 1' },
  { id: 'mcat', name: 'MCAT®' },
];

interface SidebarProps {
  store: StudyStore;
}

export default function Sidebar({ store }: SidebarProps) {
  const { 
    sidebarOpen,
    toggleSidebar,
  } = store;

  const [selectedExamId, setSelectedExamId] = useState<string>('step1');
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const pathname = usePathname();

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setExamDropdownOpen(false);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <BonsaiIcon size={22} className="logo-icon" />
          <span className="logo-text">Bonsai</span>
        </div>
        <button 
          className="sidebar-close"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Exam Selector - separate section */}
      <div className="exam-selector">
        <button 
          className="exam-selector-button"
          onClick={() => setExamDropdownOpen(!examDropdownOpen)}
        >
          <span className="exam-name">{selectedExam.name}</span>
          <ChevronsUpDown size={14} className="exam-chevron" />
        </button>
        
        {examDropdownOpen && (
          <div className="exam-dropdown">
            {exams.map((exam) => (
              <button
                key={exam.id}
                className={`exam-option ${exam.id === selectedExamId ? 'selected' : ''}`}
                onClick={() => handleExamSelect(exam.id)}
              >
                {exam.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {/* Study Section */}
        <div className="nav-section">
          <span className="nav-section-label">Study</span>
          <Link
            href="/"
            className={`sidebar-nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            <Home size={16} className="sidebar-nav-icon" />
            <span className="sidebar-nav-text">Upcoming Sessions</span>
          </Link>
          
          <Link
            href="/progress"
            className={`sidebar-nav-link ${pathname === '/progress' ? 'active' : ''}`}
          >
            <LineChart size={16} className="sidebar-nav-icon" />
            <span className="sidebar-nav-text">View Progress</span>
          </Link>
          
          <Link
            href="/resources"
            className={`sidebar-nav-link ${pathname === '/resources' ? 'active' : ''}`}
          >
            <BookOpen size={16} className="sidebar-nav-icon" />
            <span className="sidebar-nav-text">Resources</span>
          </Link>
        </div>

        {/* Account Section */}
        <div className="nav-section">
          <span className="nav-section-label">Account</span>
          <Link
            href="/adjust-plan"
            className={`sidebar-nav-link ${pathname === '/adjust-plan' ? 'active' : ''}`}
          >
            <CalendarCog size={16} className="sidebar-nav-icon" />
            <span className="sidebar-nav-text">Adjust Study Plan</span>
          </Link>
          
          <Link
            href="/settings"
            className={`sidebar-nav-link ${pathname === '/settings' ? 'active' : ''}`}
          >
            <Settings size={16} className="sidebar-nav-icon" />
            <span className="sidebar-nav-text">Settings</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <User size={16} className="user-icon" />
          <span className="user-name">Elyas</span>
        </div>
        <button className="logout-button">
          Log out
        </button>
      </div>
    </aside>
  );
}
