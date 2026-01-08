import { CardState, DifficultyRating, DifficultyOption } from '@/types';

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    rating: 1,
    label: 'Again',
    description: 'Review again soon',
    intervalMultiplier: 0.5,
  },
  {
    rating: 2,
    label: 'Hard',
    description: 'Difficult, but recalled',
    intervalMultiplier: 0.8,
  },
  {
    rating: 3,
    label: 'Good',
    description: 'Recalled with effort',
    intervalMultiplier: 1.0,
  },
  {
    rating: 4,
    label: 'Easy',
    description: 'Effortless recall',
    intervalMultiplier: 1.5,
  },
];

// Initial card state for a new question
export function createInitialCardState(questionId: string): CardState {
  return {
    questionId,
    interval: 1,
    easeFactor: 2.5,
    nextReview: new Date(),
    reviewCount: 0,
    lastReview: null,
  };
}

// SM-2 inspired algorithm for updating card state
export function updateCardState(
  cardState: CardState,
  rating: DifficultyRating,
  wasCorrect: boolean,
  wasSkipped: boolean
): CardState {
  const now = new Date();
  let { interval, easeFactor, reviewCount } = cardState;

  // If skipped or incorrect, reset interval and adjust ease factor
  if (wasSkipped || !wasCorrect) {
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    // Correct answer
    const option = DIFFICULTY_OPTIONS.find((o) => o.rating === rating)!;
    
    // Update ease factor based on rating
    if (rating === 1) {
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      interval = 1;
    } else if (rating === 2) {
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      interval = Math.ceil(interval * option.intervalMultiplier);
    } else if (rating === 3) {
      // Keep ease factor same
      interval = Math.ceil(interval * easeFactor);
    } else if (rating === 4) {
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      interval = Math.ceil(interval * easeFactor * option.intervalMultiplier);
    }
  }

  // Calculate next review date
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    questionId: cardState.questionId,
    interval,
    easeFactor,
    nextReview,
    reviewCount: reviewCount + 1,
    lastReview: now,
  };
}

// Check if a card is due for review
export function isCardDue(cardState: CardState): boolean {
  return new Date() >= cardState.nextReview;
}

// Calculate mastery percentage based on card states
export function calculateMastery(cardStates: CardState[]): number {
  if (cardStates.length === 0) return 0;
  
  // Cards with interval > 7 days are considered "learned"
  const learnedCount = cardStates.filter((c) => c.interval >= 7).length;
  return Math.round((learnedCount / cardStates.length) * 100);
}

// Get time until next review as a human-readable string
export function getNextReviewText(cardState: CardState): string {
  const now = new Date();
  const diff = cardState.nextReview.getTime() - now.getTime();
  
  if (diff <= 0) return 'Now';
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

