'use client';

import { useStudyStore } from '@/lib/studyStore';
import Sidebar from '@/components/Sidebar';
import QuestionCard from '@/components/QuestionCard';
import SessionComplete from '@/components/SessionComplete';
import HomeCalendar from '@/components/HomeCalendar';
import SubjectDetail from '@/components/SubjectDetail';
import ThemeToggle from '@/components/ThemeToggle';
import { PanelLeft } from 'lucide-react';

export default function Home() {
  const store = useStudyStore();
  const { selectedDeckId, isSessionComplete, currentQuestion, sidebarOpen, toggleSidebar, selectedSubject, clearSubject } = store;

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar store={store} />
      
      {/* Sidebar toggle button - only show when sidebar is closed */}
      {!sidebarOpen && (
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <PanelLeft size={18} />
        </button>
      )}
      
      <main className="main-content home-view">
        <ThemeToggle />
        
        {/* Subject Detail View */}
        {selectedSubject && !selectedDeckId && (
          <SubjectDetail subject={selectedSubject} onBack={clearSubject} />
        )}
        
        {/* Home Calendar - only show when no subject or deck selected */}
        {!selectedDeckId && !selectedSubject && <HomeCalendar />}
        
        {selectedDeckId && isSessionComplete && <SessionComplete store={store} />}
        
        {selectedDeckId && !isSessionComplete && currentQuestion && (
          <QuestionCard store={store} />
        )}
      </main>
    </div>
  );
}
