'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, ArrowRight, PanelLeft } from 'lucide-react';
import { useStudyStore } from '@/lib/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserStudyProfile, getUserStudyProfile } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import ProtectedRoute from '@/components/ProtectedRoute';

const RESOURCES = [
  'UWorld',
  'NBME Practice Exams',
  'Anki',
  'Pathoma',
  'Sketchy Micro',
  'Dirty Medicine',
  'Pixorize',
  'Mehlman',
  'Divine Intervention',
  'NBME High-Yield Images PDFs',
];

const STUDY_STYLES = [
  { id: 'intensive', label: 'Intensive', description: 'High volume, focused study sessions' },
  { id: 'balanced', label: 'Balanced', description: 'Moderate pace with regular breaks' },
  { id: 'relaxed', label: 'Relaxed', description: 'Steady progress, lower daily load' },
] as const;

type StudyStyle = typeof STUDY_STYLES[number]['id'];

interface FormData {
  name: string;
  exam: string;
  idealScore: number;
  minimumScore: number;
  examDate: string;
  resources: string[];
  studyStyle: StudyStyle | '';
}

export default function AdjustPlanPage() {
  const store = useStudyStore();
  const { sidebarOpen, toggleSidebar } = store;
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    exam: 'USMLE Step 1',
    idealScore: 250,
    minimumScore: 230,
    examDate: '',
    resources: [],
    studyStyle: '',
  });

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const profile = await getUserStudyProfile(user.uid);
          if (profile) {
            setFormData({
              name: profile.name,
              exam: profile.exam,
              idealScore: profile.targetScore,
              minimumScore: profile.minimumScore,
              examDate: profile.examDate,
              resources: profile.resources,
              studyStyle: profile.studyStyle,
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
      setIsLoading(false);
    }
    loadProfile();
  }, [user]);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentStep]);

  const totalSteps = 7;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name.trim().length > 0;
      case 1: return formData.exam.length > 0;
      case 2: return formData.idealScore >= 194 && formData.idealScore <= 300;
      case 3: return formData.minimumScore >= 194 && formData.minimumScore <= 300;
      case 4: return formData.examDate.length > 0;
      case 5: return formData.resources.length > 0;
      case 6: return formData.studyStyle.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (currentStep === totalSteps - 1) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed()) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.studyStyle) return;
    setIsSaving(true);
    try {
      await saveUserStudyProfile(user.uid, {
        name: formData.name,
        exam: formData.exam,
        targetScore: formData.idealScore,
        minimumScore: formData.minimumScore,
        examDate: formData.examDate,
        resources: formData.resources,
        studyStyle: formData.studyStyle,
      });
      router.push('/app');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
    }
  };

  const toggleResource = (resource: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.includes(resource)
        ? prev.resources.filter(r => r !== resource)
        : [...prev.resources, resource],
    }));
  };

  const questions = [
    "What's your name?",
    "What exam are you studying for?",
    "What's your ideal score?",
    "What's your minimum acceptable score?",
    "When is your exam?",
    "What resources do you have access to?",
    "What's your study style?",
  ];

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
          
          <div className="typeform-page">
            <div className="typeform-card">
              {isLoading ? (
                <div className="typeform-loading">
                  <div className="loading-spinner" />
                </div>
              ) : (
                <div className="typeform-question">
                {/* Question Header */}
                <div className="typeform-header">
                  <span className="typeform-number">{currentStep + 1}</span>
                  <ArrowRight size={14} className="typeform-arrow" />
                  <h2>{questions[currentStep]}</h2>
                </div>

                {/* Question Input */}
                <div className="typeform-input-area">
                  {currentStep === 0 && (
                    <input
                      ref={inputRef}
                      type="text"
                      className="typeform-text-input"
                      placeholder="Type your answer here..."
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      onKeyDown={handleKeyDown}
                    />
                  )}

                  {currentStep === 1 && (
                    <div className="typeform-select-wrapper">
                      <select
                        className="typeform-select"
                        value={formData.exam}
                        onChange={(e) => setFormData(prev => ({ ...prev, exam: e.target.value }))}
                      >
                        <option value="USMLE Step 1">USMLE Step 1</option>
                      </select>
                      <ChevronDown size={18} className="typeform-select-icon" />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="typeform-slider-container">
                      <div className="typeform-score-display">
                        <span className="score-value">{formData.idealScore}</span>
                      </div>
                      <input
                        type="range"
                        className="typeform-slider"
                        min={194}
                        max={300}
                        value={formData.idealScore}
                        onChange={(e) => setFormData(prev => ({ ...prev, idealScore: parseInt(e.target.value) }))}
                      />
                      <div className="typeform-slider-labels">
                        <span>194</span>
                        <span>300</span>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="typeform-slider-container">
                      <div className="typeform-score-display">
                        <span className="score-value">{formData.minimumScore}</span>
                      </div>
                      <input
                        type="range"
                        className="typeform-slider"
                        min={194}
                        max={300}
                        value={formData.minimumScore}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumScore: parseInt(e.target.value) }))}
                      />
                      <div className="typeform-slider-labels">
                        <span>194</span>
                        <span>300</span>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <input
                      ref={inputRef}
                      type="date"
                      className="typeform-text-input typeform-date"
                      value={formData.examDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                      onKeyDown={handleKeyDown}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  )}

                  {currentStep === 5 && (
                    <div className="typeform-choices two-columns">
                      {RESOURCES.map((resource) => (
                        <button
                          key={resource}
                          className={`typeform-choice ${formData.resources.includes(resource) ? 'selected' : ''}`}
                          onClick={() => toggleResource(resource)}
                        >
                          <span className="choice-checkbox">
                            {formData.resources.includes(resource) && <Check size={14} />}
                          </span>
                          <span className="choice-text">{resource}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="typeform-choices">
                      {STUDY_STYLES.map((style, idx) => (
                        <button
                          key={style.id}
                          className={`typeform-choice ${formData.studyStyle === style.id ? 'selected' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, studyStyle: style.id }))}
                        >
                          <span className="choice-letter">{String.fromCharCode(65 + idx)}</span>
                          <div className="choice-content">
                            <span className="choice-text">{style.label}</span>
                            <span className="choice-desc">{style.description}</span>
                          </div>
                          {formData.studyStyle === style.id && <Check size={16} className="choice-check" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="typeform-action">
                  <button
                    className="typeform-done-btn"
                    onClick={handleNext}
                    disabled={!canProceed() || isSaving}
                  >
                    {currentStep === totalSteps - 1 ? (isSaving ? 'Saving...' : 'Done') : 'OK'}
                    <Check size={16} />
                  </button>
                  <span className="typeform-enter-hint">
                    press <strong>Enter ↵</strong>
                  </span>
                </div>
              </div>
            )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
