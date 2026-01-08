'use client';

import { useStudyStore } from '@/lib/studyStore';
import Sidebar from '@/components/Sidebar';
import QuestionCard from '@/components/QuestionCard';
import SessionComplete from '@/components/SessionComplete';
import WelcomeScreen from '@/components/WelcomeScreen';
import ThemeToggle from '@/components/ThemeToggle';
import { PanelLeft } from 'lucide-react';

export default function Home() {
  const store = useStudyStore();
  const { selectedDeckId, isSessionComplete, currentQuestion, sidebarOpen, toggleSidebar } = store;

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
      
      <main className="main-content">
        <ThemeToggle />
        
        {!selectedDeckId && <WelcomeScreen />}
        
        {selectedDeckId && isSessionComplete && <SessionComplete store={store} />}
        
        {selectedDeckId && !isSessionComplete && currentQuestion && (
          <QuestionCard store={store} />
        )}
      </main>
    </div>
  );
}
