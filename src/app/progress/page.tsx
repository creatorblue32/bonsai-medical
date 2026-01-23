'use client';

import { PanelLeft } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useStudyStore } from '@/lib/studyStore';

const step1Topics = [
  {
    id: 'human-development',
    name: 'Human Development',
    importance: '1-3%',
    proficiency: 3.8,
  },
  {
    id: 'blood-immune',
    name: 'Blood & Lymphoreticular/Immune Systems',
    importance: '9-13%',
    proficiency: 5.2,
  },
  {
    id: 'behavioral-nervous',
    name: 'Behavioral Health & Nervous Systems/Special Senses',
    importance: '10-14%',
    proficiency: 7.9,
  },
  {
    id: 'musculoskeletal-skin',
    name: 'Musculoskeletal, Skin & Subcutaneous Tissue',
    importance: '8-12%',
    proficiency: 4.1,
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    importance: '7-11%',
    proficiency: 8.7,
  },
  {
    id: 'respiratory-renal',
    name: 'Respiratory & Renal/Urinary Systems',
    importance: '11-15%',
    proficiency: 2.4,
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal System',
    importance: '6-10%',
    proficiency: 6.8,
  },
  {
    id: 'reproductive-endocrine',
    name: 'Reproductive & Endocrine Systems',
    importance: '12-16%',
    proficiency: 5.6,
  },
  {
    id: 'multisystem',
    name: 'Multisystem Processes & Disorders',
    importance: '8-12%',
    proficiency: 4.9,
  },
  {
    id: 'biostats',
    name: 'Biostatistics & Epidemiology/Population Health',
    importance: '4-6%',
    proficiency: 9.1,
  },
  {
    id: 'social-sciences',
    name: 'Social Sciences: Communication and Interpersonal Skills',
    importance: '6-9%',
    proficiency: 7.3,
  },
];

const getProficiencyStatus = (score: number) => {
  if (score < 3) return { label: 'Critical', class: 'critical' };
  if (score < 6) return { label: 'Needs Work', class: 'needs-work' };
  if (score < 9) return { label: 'Acceptable', class: 'acceptable' };
  return { label: 'Proficient', class: 'proficient' };
};

export default function ProgressPage() {
  const store = useStudyStore();
  const { sidebarOpen, toggleSidebar } = store;

  return (
    <ProtectedRoute>
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar store={store} />

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

        <div className="progress-page">
          <div className="progress-card">
            {/* Estimated Step 1 Score */}
            <div className="step1-score-section">
              <span className="step1-score-label">Estimated Step 1 Score</span>
              <span className="step1-score-value">235</span>
              <span className="step1-score-subtitle">Based on current proficiency</span>
            </div>

          {/* Two-column grid of topics */}
          <div className="progress-grid">
            {/* Header row */}
            <div className="progress-topic-header-row">
              <div className="progress-header-topic">Topic</div>
              <div className="progress-topic-meta">
                <span className="progress-header-weight">Exam Weight</span>
                <span className="progress-header-proficiency">Proficiency</span>
              </div>
            </div>

            {/* Topic rows */}
            {step1Topics.map((topic) => {
                const status = getProficiencyStatus(topic.proficiency);
                return (
                  <div key={topic.id} className="progress-topic-item">
                    <div className="progress-topic-name">{topic.name}</div>
                    <div className="progress-topic-meta">
                      <span className="progress-meta-value">{topic.importance}</span>
                      <span className={`progress-proficiency-badge ${status.class}`}>
                        <span className="proficiency-score">{topic.proficiency.toFixed(1)}</span>
                        <span className="proficiency-label">{status.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
