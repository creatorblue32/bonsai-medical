export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  reinforcement: string;
  explanation: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
  decks: string[];
}

export interface QuestionData {
  sequences: Sequence[];
  decks: Deck[];
  questions: Question[];
}

// Spaced repetition card state
export interface CardState {
  questionId: string;
  interval: number; // days until next review
  easeFactor: number; // multiplier for interval
  nextReview: Date;
  reviewCount: number;
  lastReview: Date | null;
}

// User's answer result
export interface AnswerResult {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  skipped: boolean; // true if user clicked "I don't know"
}

// Difficulty ratings (like Anki)
export type DifficultyRating = 1 | 2 | 3 | 4;

export interface DifficultyOption {
  rating: DifficultyRating;
  label: string;
  description: string;
  intervalMultiplier: number;
}

// Session state for a deck
export interface DeckSession {
  deckId: string;
  newCards: string[]; // question IDs that are new
  dueCards: string[]; // question IDs due for review
  currentIndex: number;
  queue: string[]; // combined queue of cards to study
}

// Study statistics for sidebar
export interface DeckStats {
  deckId: string;
  newCount: number;
  dueCount: number;
  totalCount: number;
  masteryPercent: number; // 0-100, for progress indicator
}

// For the sidebar sequence/deck tree
export interface SidebarSequence extends Sequence {
  deckStats: DeckStats[];
  isExpanded: boolean;
}

