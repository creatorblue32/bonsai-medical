'use client';

import { ChevronDown, ChevronRight, BookOpen, Layers, X } from 'lucide-react';
import BonsaiIcon from './BonsaiIcon';
import { StudyStore } from '@/lib/studyStore';

interface SidebarProps {
  store: StudyStore;
}

export default function Sidebar({ store }: SidebarProps) {
  const { 
    sequences, 
    decks, 
    expandedSequences, 
    toggleSequence, 
    selectDeck, 
    getDeckStats,
    selectedDeckId,
    sidebarOpen,
    toggleSidebar
  } = store;

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

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Library</div>
          
          {sequences.map((sequence) => {
            const isExpanded = expandedSequences.has(sequence.id);
            const sequenceDecks = decks.filter((d) => sequence.decks.includes(d.id));
            
            // Calculate overall sequence stats
            const totalNew = sequenceDecks.reduce((sum, d) => sum + getDeckStats(d.id).newCount, 0);
            const totalDue = sequenceDecks.reduce((sum, d) => sum + getDeckStats(d.id).dueCount, 0);

            return (
              <div key={sequence.id} className="sequence-group">
                <button
                  onClick={() => toggleSequence(sequence.id)}
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
                  <span className="sequence-name">{sequence.name}</span>
                  {(totalNew > 0 || totalDue > 0) && (
                    <span className="sequence-badge">
                      {totalNew > 0 && <span className="badge-new">{totalNew}</span>}
                      {totalDue > 0 && <span className="badge-due">{totalDue}</span>}
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="deck-list">
                    {sequenceDecks.map((deck) => {
                      const stats = getDeckStats(deck.id);
                      const isSelected = selectedDeckId === deck.id;

                      return (
                        <button
                          key={deck.id}
                          onClick={() => selectDeck(deck.id)}
                          className={`deck-button ${isSelected ? 'selected' : ''}`}
                        >
                          <BookOpen size={14} className="deck-icon" />
                          <span className="deck-name">{deck.name}</span>
                          <div className="deck-stats">
                            {stats.newCount > 0 && (
                              <span className="stat-new" title="New cards">
                                {stats.newCount}
                              </span>
                            )}
                            {stats.dueCount > 0 && (
                              <span className="stat-due" title="Due for review">
                                {stats.dueCount}
                              </span>
                            )}
                            <span className="stat-total" title="Total cards">
                              {stats.totalCount}
                            </span>
                          </div>
                          
                          {/* Mastery indicator */}
                          <div className="mastery-bar">
                            <div 
                              className="mastery-fill"
                              style={{ width: `${stats.masteryPercent}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
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
