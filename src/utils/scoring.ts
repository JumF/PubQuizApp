// Scoring configuration
const BASE_POINTS = 1000;
const TIME_PENALTY = 10; // points deducted per second

/**
 * Calculate points earned based on time spent
 * @param timeSpent Time spent in seconds
 * @param maxTime Maximum time allowed
 * @returns Points earned
 */
export const calculatePoints = (timeSpent: number, maxTime: number): number => {
  if (timeSpent > maxTime) {
    return 0;
  }
  
  const points = BASE_POINTS - (timeSpent * TIME_PENALTY);
  return Math.max(0, Math.round(points));
};

/**
 * Calculate accuracy percentage
 * @param correct Number of correct answers
 * @param total Total number of questions
 * @returns Accuracy percentage
 */
export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Calculate rank based on score
 * @param players Array of players with scores
 * @param playerId Player to calculate rank for
 * @returns Rank (1-based)
 */
export const calculateRank = (
  players: Array<{ id: string; totalScore: number }>,
  playerId: string
): number => {
  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const index = sorted.findIndex(p => p.id === playerId);
  return index + 1;
};

