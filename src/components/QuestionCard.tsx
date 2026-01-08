'use client';

import { useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { StudyStore } from '@/lib/studyStore';
import { DIFFICULTY_OPTIONS } from '@/lib/spacedRepetition';
import { DifficultyRating } from '@/types';

interface QuestionCardProps {
  store: StudyStore;
}

export default function QuestionCard({ store }: QuestionCardProps) {
  const {
    currentQuestion,
    lastAnswer,
    showingResult,
    submitAnswer,
    rateDifficulty,
    continueAfterCorrect,
    selectedDeck,
    currentQuestionIndex,
    studyQueue,
  } = store;

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default for our keys
      if (['1', '2', '3', '4', 's', 'S', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!currentQuestion) return;

      // Not showing result - answering phase
      if (!showingResult) {
        // Number keys 1-4 to select answer
        if (['1', '2', '3', '4'].includes(e.key)) {
          const index = parseInt(e.key) - 1;
          if (index < currentQuestion.options.length) {
            submitAnswer(index);
          }
        }
        // S to skip (I don't know)
        if (e.key === 's' || e.key === 'S') {
          submitAnswer(-1, true);
        }
      } else {
        // Showing result phase
        if (lastAnswer?.isCorrect) {
          // Correct answer - Enter/Space to continue
          if (e.key === 'Enter' || e.key === ' ') {
            continueAfterCorrect();
          }
        } else {
          // Incorrect/skipped - number keys to rate difficulty
          // But if skipped, only allow 3 and 4 (grayed out 1 and 2)
          if (['1', '2', '3', '4'].includes(e.key)) {
            const rating = parseInt(e.key) as DifficultyRating;
            if (lastAnswer?.skipped && rating <= 2) {
              // Can't use easy ratings if skipped
              return;
            }
            rateDifficulty(rating);
          }
        }
      }
    },
    [currentQuestion, showingResult, lastAnswer, submitAnswer, rateDifficulty, continueAfterCorrect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentQuestion) {
    return null;
  }

  const progress = studyQueue.length > 0 
    ? ((currentQuestionIndex) / studyQueue.length) * 100 
    : 0;

  return (
    <>
      <div className="question-container">
        {/* Progress bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Deck info */}
        <div className="deck-info">
          <span className="deck-title">{selectedDeck?.name}</span>
          <span className="question-counter">
            {currentQuestionIndex + 1} / {studyQueue.length}
          </span>
        </div>

        {/* Question */}
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>

          {/* Answer Options */}
          <div className="options-container">
            {currentQuestion.options.map((option, index) => {
              const isSelected = lastAnswer?.selectedIndex === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showCorrect = showingResult && isCorrect;
              const showIncorrect = showingResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showingResult && submitAnswer(index)}
                  disabled={showingResult}
                  className={`option-button ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''} ${isSelected && showingResult ? 'selected' : ''}`}
                >
                  <span className="option-key">
                    {showCorrect ? (
                      <Check size={14} strokeWidth={3} />
                    ) : showIncorrect ? (
                      <X size={14} strokeWidth={2.5} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Result feedback - inline for correct answers */}
          {showingResult && lastAnswer?.isCorrect && (
            <div className="result-feedback correct">
              <div className="reinforcement">{currentQuestion.reinforcement}</div>
            </div>
          )}

          {/* Explanation for incorrect - stays in card */}
          {showingResult && !lastAnswer?.isCorrect && (
            <div className="result-feedback incorrect">
              <div className="explanation">
                <h3>Explanation</h3>
                <p>{currentQuestion.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar - always present */}
      <div className="bottom-action-bar">
        {/* Skip / I don't know - shown when answering */}
        {!showingResult && (
          <button
            onClick={() => submitAnswer(-1, true)}
            className="skip-bar-button"
          >
            <span className="skip-key">S</span>
            <span>Show answer</span>
          </button>
        )}

        {/* Continue - shown for correct answers */}
        {showingResult && lastAnswer?.isCorrect && (
          <button
            onClick={continueAfterCorrect}
            className="continue-bar-button"
          >
            <span>Continue</span>
            <span className="continue-key">Enter</span>
          </button>
        )}

        {/* Difficulty selection - shown for incorrect answers */}
        {showingResult && !lastAnswer?.isCorrect && (
          <>
            <span className="difficulty-prompt">How difficult was this?</span>
            <div className="difficulty-options">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const isDisabled = lastAnswer?.skipped && opt.rating <= 2;
                
                return (
                  <button
                    key={opt.rating}
                    onClick={() => !isDisabled && rateDifficulty(opt.rating)}
                    disabled={isDisabled}
                    className={`difficulty-button rating-${opt.rating} ${isDisabled ? 'disabled' : ''}`}
                  >
                    <span className="difficulty-key">{opt.rating}</span>
                    <span className="difficulty-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
