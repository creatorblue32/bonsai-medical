'use client';

import { useState, useCallback } from 'react';
import { 
  CardState, 
  DeckStats, 
  AnswerResult,
  DifficultyRating,
  Question,
  Deck,
  Sequence,
  Passage,
} from '@/types';
import { 
  createInitialCardState, 
  updateCardState, 
  isCardDue, 
  calculateMastery 
} from './spacedRepetition';
import questionData from '@/data/questions.json';

// Initialize card states from questions
function initializeCardStates(): Map<string, CardState> {
  const states = new Map<string, CardState>();
  questionData.questions.forEach((q) => {
    states.set(q.id, createInitialCardState(q.id));
  });
  return states;
}

export function useStudyStore() {
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(initializeCardStates);
  const [expandedSequences, setExpandedSequences] = useState<Set<string>>(new Set(['mcat-full-length-1', 'mcat-quick-review']));
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState<string[]>([]);
  const [lastAnswer, setLastAnswer] = useState<AnswerResult | null>(null);
  const [showingResult, setShowingResult] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // Get all data
  const sequences = questionData.sequences as Sequence[];
  const decks = questionData.decks as Deck[];
  const passages = (questionData.passages || []) as Passage[];
  const questions = questionData.questions as Question[];

  // Get passage for a question
  const getPassageForQuestion = useCallback((questionId: string): Passage | null => {
    const question = questions.find((q) => q.id === questionId);
    if (!question || !question.passageId) return null;
    return passages.find((p) => p.id === question.passageId) || null;
  }, [questions, passages]);

  // Get current passage
  const currentPassage = studyQueue.length > 0 && currentQuestionIndex < studyQueue.length
    ? getPassageForQuestion(studyQueue[currentQuestionIndex])
    : null;

  // Get deck stats
  const getDeckStats = useCallback((deckId: string): DeckStats => {
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return { deckId, newCount: 0, dueCount: 0, totalCount: 0, masteryPercent: 0 };

    const deckCardStates = deck.questionIds
      .map((qId) => cardStates.get(qId))
      .filter((s): s is CardState => s !== undefined);

    const newCount = deckCardStates.filter((s) => s.reviewCount === 0).length;
    const dueCount = deckCardStates.filter((s) => s.reviewCount > 0 && isCardDue(s)).length;
    const masteryPercent = calculateMastery(deckCardStates);

    return {
      deckId,
      newCount,
      dueCount,
      totalCount: deck.questionIds.length,
      masteryPercent,
    };
  }, [cardStates, decks]);

  // Toggle sequence expansion
  const toggleSequence = useCallback((sequenceId: string) => {
    setExpandedSequences((prev) => {
      const next = new Set(prev);
      if (next.has(sequenceId)) {
        next.delete(sequenceId);
      } else {
        next.add(sequenceId);
      }
      return next;
    });
  }, []);

  // Start studying a deck
  const selectDeck = useCallback((deckId: string) => {
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return;

    // Build study queue: due cards first, then new cards
    const dueCards = deck.questionIds.filter((qId) => {
      const state = cardStates.get(qId);
      return state && state.reviewCount > 0 && isCardDue(state);
    });

    const newCards = deck.questionIds.filter((qId) => {
      const state = cardStates.get(qId);
      return state && state.reviewCount === 0;
    });

    const queue = [...dueCards, ...newCards];

    setSelectedDeckId(deckId);
    setStudyQueue(queue);
    setCurrentQuestionIndex(0);
    setLastAnswer(null);
    setShowingResult(false);
    setSidebarOpen(false); // Auto-hide sidebar when deck selected
    setShowChat(false);
  }, [cardStates, decks]);

  // Get current question
  const currentQuestion = studyQueue.length > 0 && currentQuestionIndex < studyQueue.length
    ? questions.find((q) => q.id === studyQueue[currentQuestionIndex])
    : null;

  // Submit an answer
  const submitAnswer = useCallback((selectedIndex: number, skipped: boolean = false) => {
    if (!currentQuestion) return;

    const isCorrect = !skipped && selectedIndex === currentQuestion.correctIndex;
    
    setLastAnswer({
      questionId: currentQuestion.id,
      selectedIndex,
      isCorrect,
      skipped,
    });
    setShowingResult(true);
    
    // Show chat interface for incorrect answers
    if (!isCorrect) {
      setShowChat(true);
    }
  }, [currentQuestion]);

  // Rate difficulty and move to next question
  const rateDifficulty = useCallback((rating: DifficultyRating) => {
    if (!lastAnswer || !currentQuestion) return;

    // Update card state
    const currentState = cardStates.get(currentQuestion.id);
    if (currentState) {
      const newState = updateCardState(
        currentState,
        rating,
        lastAnswer.isCorrect,
        lastAnswer.skipped
      );
      
      setCardStates((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, newState);
        return next;
      });
    }

    // Move to next question
    setCurrentQuestionIndex((prev) => prev + 1);
    setLastAnswer(null);
    setShowingResult(false);
    setShowChat(false);
  }, [lastAnswer, currentQuestion, cardStates]);

  // Continue after correct answer
  const continueAfterCorrect = useCallback(() => {
    if (!lastAnswer || !currentQuestion) return;

    // For correct answers, use rating 3 (Good) by default
    const currentState = cardStates.get(currentQuestion.id);
    if (currentState) {
      const newState = updateCardState(currentState, 3, true, false);
      
      setCardStates((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, newState);
        return next;
      });
    }

    // Move to next question
    setCurrentQuestionIndex((prev) => prev + 1);
    setLastAnswer(null);
    setShowingResult(false);
    setShowChat(false);
  }, [lastAnswer, currentQuestion, cardStates]);

  // Close study session
  const closeDeck = useCallback(() => {
    setSelectedDeckId(null);
    setStudyQueue([]);
    setCurrentQuestionIndex(0);
    setLastAnswer(null);
    setShowingResult(false);
    setSidebarOpen(true); // Show sidebar when returning to library
    setShowChat(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Check if session is complete
  const isSessionComplete = studyQueue.length > 0 && currentQuestionIndex >= studyQueue.length;

  // Get selected deck info
  const selectedDeck = selectedDeckId ? decks.find((d) => d.id === selectedDeckId) : null;

  return {
    // Data
    sequences,
    decks,
    passages,
    questions,
    cardStates,
    expandedSequences,
    
    // Current study state
    selectedDeckId,
    selectedDeck,
    currentQuestion,
    currentPassage,
    currentQuestionIndex,
    studyQueue,
    lastAnswer,
    showingResult,
    isSessionComplete,
    sidebarOpen,
    
    // Chat state
    showChat,
    
    // Actions
    getDeckStats,
    toggleSequence,
    selectDeck,
    submitAnswer,
    rateDifficulty,
    continueAfterCorrect,
    closeDeck,
    toggleSidebar,
    getPassageForQuestion,
  };
}

export type StudyStore = ReturnType<typeof useStudyStore>;
