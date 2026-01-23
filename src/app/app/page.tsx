'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudyStore } from '@/lib/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { getUserStudyProfile } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';
import QuestionCard from '@/components/QuestionCard';
import SessionComplete from '@/components/SessionComplete';
import HomeCalendar from '@/components/HomeCalendar';
import SubjectDetail from '@/components/SubjectDetail';
import ThemeToggle from '@/components/ThemeToggle';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PanelLeft } from 'lucide-react';

export default function AppPage() {
  const store = useStudyStore();
  const { selectedDeckId, isSessionComplete, currentQuestion, sidebarOpen, toggleSidebar, selectedSubject, clearSubject } = store;
  const { user } = useAuth();
  const router = useRouter();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (user) {
        try {
          const profile = await getUserStudyProfile(user.uid);
          if (!profile) {
            router.push('/adjust-plan');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        } finally {
          setCheckingProfile(false);
        }
      }
    }
    checkProfile();
  }, [user, router]);

  if (checkingProfile) {
    return (
      <ProtectedRoute>
        <div className="loading-screen">
          <div className="loading-spinner" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
