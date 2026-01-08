'use client';

import { BookOpen, Zap, Brain, Sprout } from 'lucide-react';

export default function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-logo">
          <Sprout size={48} className="welcome-icon" />
          <h1 className="welcome-title">Bonsai</h1>
        </div>
        
        <p className="welcome-subtitle">
          Master your MCAT prep with spaced repetition
        </p>

        <div className="welcome-features">
          <div className="feature-item">
            <BookOpen size={20} className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">Select a deck</span>
              <span className="feature-desc">Choose from the sidebar to begin</span>
            </div>
          </div>
          
          <div className="feature-item">
            <Zap size={20} className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">Keyboard-first</span>
              <span className="feature-desc">Use 1-4 keys for answers, S to skip</span>
            </div>
          </div>
          
          <div className="feature-item">
            <Brain size={20} className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">Smart review</span>
              <span className="feature-desc">Spaced repetition optimizes your memory</span>
            </div>
          </div>
        </div>

        <div className="keyboard-guide">
          <div className="guide-row">
            <div className="guide-item">
              <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd>
              <span>Select answer</span>
            </div>
            <div className="guide-item">
              <kbd>S</kbd>
              <span>Skip question</span>
            </div>
            <div className="guide-item">
              <kbd>Enter</kbd>
              <span>Continue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

