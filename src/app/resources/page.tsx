'use client';

import { useStudyStore } from '@/lib/studyStore';
import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import { PanelLeft, ExternalLink, Youtube, BookOpen, FileText, Video } from 'lucide-react';

const resources = [
  {
    category: 'Video Content',
    items: [
      {
        name: 'Khan Academy Medicine',
        description: 'Comprehensive medical education videos covering anatomy, physiology, and more',
        url: 'https://www.khanacademy.org/science/health-and-medicine',
        icon: <Youtube size={20} />,
      },
      {
        name: 'Osmosis',
        description: 'High-yield medical videos and study resources',
        url: 'https://www.osmosis.org',
        icon: <Video size={20} />,
      },
      {
        name: 'Ninja Nerd',
        description: 'In-depth medical school lectures on YouTube',
        url: 'https://www.youtube.com/@NinjaNerdOfficial',
        icon: <Youtube size={20} />,
      },
      {
        name: 'Armando Hasudungan',
        description: 'Medical illustrations and pathophysiology videos',
        url: 'https://www.youtube.com/@armandohasudungan',
        icon: <Youtube size={20} />,
      },
    ],
  },
  {
    category: 'Study Resources',
    items: [
      {
        name: 'First Aid',
        description: 'Essential USMLE Step 1 review resource',
        url: 'https://firstaidteam.com',
        icon: <BookOpen size={20} />,
      },
      {
        name: 'Anki',
        description: 'Powerful spaced repetition flashcard software',
        url: 'https://apps.ankiweb.net',
        icon: <FileText size={20} />,
      },
      {
        name: 'Sketchy',
        description: 'Visual learning for microbiology, pharmacology, and pathology',
        url: 'https://www.sketchy.com',
        icon: <Video size={20} />,
      },
    ],
  },
  {
    category: 'Practice Questions',
    items: [
      {
        name: 'UWorld',
        description: 'Gold standard for USMLE practice questions',
        url: 'https://www.uworld.com',
        icon: <FileText size={20} />,
      },
      {
        name: 'Amboss',
        description: 'Medical knowledge platform with integrated question bank',
        url: 'https://www.amboss.com',
        icon: <BookOpen size={20} />,
      },
    ],
  },
  {
    category: 'Reference Materials',
    items: [
      {
        name: 'PubMed',
        description: 'Free medical literature database',
        url: 'https://pubmed.ncbi.nlm.nih.gov',
        icon: <BookOpen size={20} />,
      },
      {
        name: 'UpToDate',
        description: 'Evidence-based clinical decision support',
        url: 'https://www.uptodate.com',
        icon: <FileText size={20} />,
      },
    ],
  },
];

export default function ResourcesPage() {
  const store = useStudyStore();
  const { sidebarOpen, toggleSidebar } = store;

  return (
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
        
        <div className="resources-page">
          <div className="resources-card">
            <div className="resources-header">
              <h1 className="resources-title">Study Resources</h1>
              <p className="resources-subtitle">
                Curated collection of high-yield materials to supplement your study plan
              </p>
            </div>

            <div className="resources-content">
              {resources.map((section, idx) => (
                <div key={idx} className="resource-section">
                  <h2 className="resource-category">{section.category}</h2>
                  <div className="resource-list">
                    {section.items.map((item, itemIdx) => (
                      <a
                        key={itemIdx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-item"
                      >
                        <div className="resource-icon-wrapper">
                          {item.icon}
                        </div>
                        <div className="resource-text">
                          <div className="resource-name-row">
                            <span className="resource-name">{item.name}</span>
                            <ExternalLink size={14} className="resource-external" />
                          </div>
                          <span className="resource-description">{item.description}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
