'use client';

import { useEffect, useCallback, useState } from 'react';
import { Check, X } from 'lucide-react';
import { StudyStore } from '@/lib/studyStore';
import { DIFFICULTY_OPTIONS } from '@/lib/spacedRepetition';
import { DifficultyRating } from '@/types';
import ChatInterface from './ChatInterface';
import PassageContent from './PassageContent';

interface QuestionCardProps {
  store: StudyStore;
}

export default function QuestionCard({ store }: QuestionCardProps) {
  const {
    currentQuestion,
    currentPassage,
    lastAnswer,
    showingResult,
    submitAnswer,
    rateDifficulty,
    continueAfterCorrect,
    selectedDeck,
    currentQuestionIndex,
    studyQueue,
    showChat,
  } = store;

  // Track which options should be collapsed (animated away)
  const [collapsedOptions, setCollapsedOptions] = useState<Set<number>>(new Set());
  const [animationComplete, setAnimationComplete] = useState(false);

  // Reset collapsed options when question changes
  useEffect(() => {
    setCollapsedOptions(new Set());
    setAnimationComplete(false);
  }, [currentQuestionIndex]);

  // Animate away wrong options when showing incorrect result
  useEffect(() => {
    if (showingResult && lastAnswer && !lastAnswer.isCorrect && currentQuestion) {
      // Start collapsing animation after a short delay
      const timer = setTimeout(() => {
        const optionsToCollapse = new Set<number>();
        currentQuestion.options.forEach((_, index) => {
          const isSelected = lastAnswer.selectedIndex === index;
          const isCorrect = index === currentQuestion.correctIndex;
          // Collapse options that are neither selected nor correct
          if (!isSelected && !isCorrect) {
            optionsToCollapse.add(index);
          }
        });
        setCollapsedOptions(optionsToCollapse);
        
        // Mark animation as complete after transition
        setTimeout(() => {
          setAnimationComplete(true);
        }, 400);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [showingResult, lastAnswer, currentQuestion]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't handle keys if chat input is focused
      if (document.activeElement?.closest('.chat-interface')) {
        return;
      }

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

  const hasPassage = currentPassage !== null;

  return (
    <>
      <div className={`question-layout ${hasPassage ? 'has-passage' : 'no-passage'}`}>
        {/* Left Panel - Passage */}
        {hasPassage && (
          <div className="passage-panel">
            <div className="passage-container">
              <div className="passage-header">
                <span className="passage-label">Passage</span>
                <h3 className="passage-title">{currentPassage.title}</h3>
              </div>
              <PassageContent content={currentPassage.content} />
            </div>
          </div>
        )}

        {/* Right Panel - Question and Answers */}
        <div className="question-panel">
          <div className="question-container">
            {/* Question */}
            <div className="question-card">
              {/* Card Header with Progress */}
              <div className="question-card-header">
                <div className="header-left">
                  <span className="header-label">Question</span>
                  <span className="header-title">{selectedDeck?.name}</span>
                </div>
                <div className="header-right">
                  <span className="question-counter">
                    {currentQuestionIndex + 1} / {studyQueue.length}
                  </span>
                  <div className="progress-bar-mini">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="question-card-body">
                <h2 className="question-text">{currentQuestion.question}</h2>

                {/* Answer Options */}
              <div className="options-container">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = lastAnswer?.selectedIndex === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const showCorrect = showingResult && isCorrect;
                  const showIncorrect = showingResult && isSelected && !isCorrect;
                  const isCollapsed = collapsedOptions.has(index);
                  const shouldHide = animationComplete && isCollapsed;

                  // Don't render if animation is complete and should be hidden
                  if (shouldHide) return null;

                  return (
                    <button
                      key={index}
                      onClick={() => !showingResult && submitAnswer(index)}
                      disabled={showingResult}
                      className={`option-button 
                        ${showCorrect ? 'correct' : ''} 
                        ${showIncorrect ? 'incorrect' : ''} 
                        ${isCollapsed ? 'collapsing' : ''}
                      `}
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

              {/* Chat Interface - integrated into card after incorrect answer */}
              {showChat && !lastAnswer?.isCorrect && (
                <ChatInterface
                  chatId={currentQuestion.id}
                  questionContext={{
                    question: currentQuestion.question,
                    userAnswer: lastAnswer?.skipped 
                      ? "I don't know (skipped)" 
                      : currentQuestion.options[lastAnswer?.selectedIndex ?? 0] || '',
                    correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
                    explanation: currentQuestion.explanation,
                  }}
                />
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className={`bottom-action-bar ${hasPassage ? 'with-passage' : ''}`}>
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
            <span className="difficulty-prompt">How well did you know this?</span>
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
