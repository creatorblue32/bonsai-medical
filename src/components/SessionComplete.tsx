'use client';

import { CheckCircle } from 'lucide-react';
import { StudyStore } from '@/lib/studyStore';

interface SessionCompleteProps {
  store: StudyStore;
}

export default function SessionComplete({ store }: SessionCompleteProps) {
  const { selectedDeck, studyQueue, closeDeck, getDeckStats } = store;

  if (!selectedDeck) return null;

  const stats = getDeckStats(selectedDeck.id);

  return (
    <div className="session-complete">
      <div className="complete-card">
        <div className="complete-icon">
          <CheckCircle size={64} />
        </div>
        
        <h2 className="complete-title">Session Complete!</h2>
        
        <p className="complete-message">
          You&apos;ve reviewed all {studyQueue.length} cards in {selectedDeck.name}
        </p>

        <div className="complete-stats">
          <div className="stat-item">
            <span className="stat-label">Mastery</span>
            <span className="stat-value">{stats.masteryPercent}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Cards Reviewed</span>
            <span className="stat-value">{studyQueue.length}</span>
          </div>
        </div>

        <div className="complete-mastery-bar">
          <div 
            className="complete-mastery-fill"
            style={{ width: `${stats.masteryPercent}%` }}
          />
        </div>

        <button
          onClick={closeDeck}
          className="back-button"
        >
          Back to Library
        </button>
      </div>
    </div>
  );
}

