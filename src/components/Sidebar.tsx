'use client';

import { useState } from 'react';
import { ChevronsUpDown, ChevronDown, ChevronRight, BookOpen, Layers, X, Check, Minus, AlertTriangle } from 'lucide-react';
import BonsaiIcon from './BonsaiIcon';
import { StudyStore } from '@/lib/studyStore';

type Status = 'good' | 'on-track' | 'behind';

type Exam = {
  id: string;
  name: string;
  sections: Section[];
};

type Section = {
  id: string;
  name: string;
  progress: number;
  status: Status;
  topics: Topic[];
};

type Topic = {
  id: string;
  name: string;
  progress: number;
  status: Status;
};

// Mock Step 1 exam data with Sections and Topics
const step1Sections: Section[] = [
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    progress: 72,
    status: 'good' as Status,
    topics: [
      { id: 'amino-acids', name: 'Amino Acids & Proteins', progress: 85, status: 'good' as Status },
      { id: 'enzymes', name: 'Enzyme Kinetics', progress: 78, status: 'good' as Status },
      { id: 'metabolism', name: 'Metabolism', progress: 65, status: 'on-track' as Status },
      { id: 'molecular-bio', name: 'Molecular Biology', progress: 70, status: 'on-track' as Status },
      { id: 'genetics', name: 'Genetics', progress: 62, status: 'on-track' as Status },
    ],
  },
  {
    id: 'immunology',
    name: 'Immunology',
    progress: 58,
    status: 'on-track' as Status,
    topics: [
      { id: 'innate-immunity', name: 'Innate Immunity', progress: 75, status: 'good' as Status },
      { id: 'adaptive-immunity', name: 'Adaptive Immunity', progress: 60, status: 'on-track' as Status },
      { id: 'lymphocytes', name: 'Lymphocytes', progress: 55, status: 'on-track' as Status },
      { id: 'immunodeficiency', name: 'Immunodeficiency', progress: 42, status: 'behind' as Status },
      { id: 'hypersensitivity', name: 'Hypersensitivity', progress: 58, status: 'on-track' as Status },
    ],
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    progress: 45,
    status: 'behind' as Status,
    topics: [
      { id: 'bacteria', name: 'Bacteriology', progress: 52, status: 'on-track' as Status },
      { id: 'viruses', name: 'Virology', progress: 48, status: 'behind' as Status },
      { id: 'fungi', name: 'Mycology', progress: 35, status: 'behind' as Status },
      { id: 'parasites', name: 'Parasitology', progress: 40, status: 'behind' as Status },
      { id: 'antimicrobials', name: 'Antimicrobials', progress: 50, status: 'on-track' as Status },
    ],
  },
  {
    id: 'pathology',
    name: 'Pathology',
    progress: 38,
    status: 'behind' as Status,
    topics: [
      { id: 'cell-injury', name: 'Cell Injury & Death', progress: 55, status: 'on-track' as Status },
      { id: 'inflammation', name: 'Inflammation', progress: 48, status: 'behind' as Status },
      { id: 'neoplasia', name: 'Neoplasia', progress: 35, status: 'behind' as Status },
      { id: 'hemodynamics', name: 'Hemodynamic Disorders', progress: 30, status: 'behind' as Status },
      { id: 'genetic-disorders', name: 'Genetic Disorders', progress: 25, status: 'behind' as Status },
    ],
  },
  {
    id: 'pharmacology',
    name: 'Pharmacology',
    progress: 52,
    status: 'on-track' as Status,
    topics: [
      { id: 'autonomic', name: 'Autonomic Drugs', progress: 65, status: 'on-track' as Status },
      { id: 'cardiovascular', name: 'Cardiovascular Drugs', progress: 58, status: 'on-track' as Status },
      { id: 'cns-drugs', name: 'CNS Drugs', progress: 45, status: 'behind' as Status },
      { id: 'antimicrobial-drugs', name: 'Antimicrobial Drugs', progress: 55, status: 'on-track' as Status },
      { id: 'toxicology', name: 'Toxicology', progress: 40, status: 'behind' as Status },
    ],
  },
  {
    id: 'physiology',
    name: 'Physiology',
    progress: 61,
    status: 'on-track' as Status,
    topics: [
      { id: 'cardiovascular-phys', name: 'Cardiovascular', progress: 72, status: 'good' as Status },
      { id: 'respiratory-phys', name: 'Respiratory', progress: 68, status: 'on-track' as Status },
      { id: 'renal-phys', name: 'Renal', progress: 55, status: 'on-track' as Status },
      { id: 'gi-phys', name: 'Gastrointestinal', progress: 58, status: 'on-track' as Status },
      { id: 'neuro-phys', name: 'Neurophysiology', progress: 52, status: 'on-track' as Status },
      { id: 'endocrine-phys', name: 'Endocrine', progress: 60, status: 'on-track' as Status },
    ],
  },
  {
    id: 'anatomy',
    name: 'Anatomy & Embryology',
    progress: 33,
    status: 'behind' as Status,
    topics: [
      { id: 'gross-anatomy', name: 'Gross Anatomy', progress: 40, status: 'behind' as Status },
      { id: 'neuroanatomy', name: 'Neuroanatomy', progress: 35, status: 'behind' as Status },
      { id: 'histology', name: 'Histology', progress: 28, status: 'behind' as Status },
      { id: 'embryology', name: 'Embryology', progress: 30, status: 'behind' as Status },
    ],
  },
  {
    id: 'behavioral',
    name: 'Behavioral Sciences',
    progress: 67,
    status: 'good' as Status,
    topics: [
      { id: 'biostatistics', name: 'Biostatistics', progress: 75, status: 'good' as Status },
      { id: 'epidemiology', name: 'Epidemiology', progress: 70, status: 'good' as Status },
      { id: 'ethics', name: 'Ethics', progress: 68, status: 'on-track' as Status },
      { id: 'psychiatry', name: 'Psychiatry', progress: 55, status: 'on-track' as Status },
    ],
  },
];

// Mock MCAT exam data
const mcatSections: Section[] = [
  {
    id: 'chem-phys',
    name: 'Chem/Phys',
    progress: 54,
    status: 'on-track' as Status,
    topics: [
      { id: 'gen-chem', name: 'General Chemistry', progress: 62, status: 'on-track' as Status },
      { id: 'org-chem', name: 'Organic Chemistry', progress: 58, status: 'on-track' as Status },
      { id: 'physics', name: 'Physics', progress: 45, status: 'behind' as Status },
      { id: 'biochem-mcat', name: 'Biochemistry', progress: 52, status: 'on-track' as Status },
    ],
  },
  {
    id: 'cars',
    name: 'CARS',
    progress: 48,
    status: 'behind' as Status,
    topics: [
      { id: 'humanities', name: 'Humanities', progress: 52, status: 'on-track' as Status },
      { id: 'social-sciences', name: 'Social Sciences', progress: 45, status: 'behind' as Status },
    ],
  },
  {
    id: 'bio-biochem',
    name: 'Bio/Biochem',
    progress: 61,
    status: 'on-track' as Status,
    topics: [
      { id: 'biology', name: 'Biology', progress: 68, status: 'on-track' as Status },
      { id: 'biochemistry-bb', name: 'Biochemistry', progress: 65, status: 'on-track' as Status },
      { id: 'org-chem-bb', name: 'Organic Chemistry', progress: 50, status: 'on-track' as Status },
    ],
  },
  {
    id: 'psych-soc',
    name: 'Psych/Soc',
    progress: 72,
    status: 'good' as Status,
    topics: [
      { id: 'psychology', name: 'Psychology', progress: 78, status: 'good' as Status },
      { id: 'sociology', name: 'Sociology', progress: 70, status: 'on-track' as Status },
      { id: 'biology-ps', name: 'Biology', progress: 68, status: 'on-track' as Status },
    ],
  },
];

const exams: Exam[] = [
  { id: 'step1', name: 'USMLE® Step 1', sections: step1Sections },
  { id: 'mcat', name: 'MCAT®', sections: mcatSections },
];

interface SidebarProps {
  store: StudyStore;
}

export default function Sidebar({ store }: SidebarProps) {
  const { 
    expandedSequences, 
    toggleSequence, 
    sidebarOpen,
    toggleSidebar,
    selectSubject,
    selectedSubject,
  } = store;

  const [selectedExamId, setSelectedExamId] = useState<string>('step1');
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const handleTopicClick = (topic: Topic) => {
    selectSubject({
      id: topic.id,
      name: topic.name,
      progress: topic.progress,
      status: topic.status,
    });
  };

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
        <div className="nav-section">
          {selectedExam.sections.map((section) => {
            const isExpanded = expandedSequences.has(section.id);

            return (
              <div key={section.id} className="sequence-group">
                <button
                  onClick={() => toggleSequence(section.id)}
                  className="sequence-button"
                >
                  <span className="sequence-chevron">
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </span>
                  <Layers size={16} className="sequence-icon" />
                  <span className="sequence-name">{section.name}</span>
                  <span className={`status-icon status-${section.status}`}>
                    {section.status === 'good' && <Check size={12} />}
                    {section.status === 'on-track' && <Minus size={12} />}
                    {section.status === 'behind' && <AlertTriangle size={10} />}
                  </span>
                  <span className="stat-total">{section.progress}%</span>
                </button>

                {isExpanded && (
                  <div className="deck-list">
                    {section.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicClick(topic)}
                          className={`deck-button ${selectedSubject?.id === topic.id ? 'selected' : ''}`}
                        >
                          <BookOpen size={14} className="deck-icon" />
                          <span className="deck-name">{topic.name}</span>
                          <span className={`status-icon status-${topic.status}`}>
                            {topic.status === 'good' && <Check size={12} />}
                            {topic.status === 'on-track' && <Minus size={12} />}
                            {topic.status === 'behind' && <AlertTriangle size={10} />}
                          </span>
                          <span className="stat-total">{topic.progress}%</span>
                        </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="keyboard-hint">
          <span className="hint-key">1-4</span>
          <span className="hint-text">Answer</span>
        </div>
        <div className="keyboard-hint">
          <span className="hint-key">S</span>
          <span className="hint-text">Skip</span>
        </div>
        <div className="keyboard-hint">
          <span className="hint-key">Enter</span>
          <span className="hint-text">Continue</span>
        </div>
      </div>
    </aside>
  );
}
