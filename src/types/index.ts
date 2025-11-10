// Quiz Types
export interface Quiz {
  id: string;
  name: string;
  roundCount: number;
  questionsPerRound: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Round {
  id: string;
  quizId: string;
  name: string;
  order: number;
}

export interface Question {
  id: string;
  roundId: string;
  quizId: string;
  text: string;
  answers: string[];
  correctIndex: number;
  order: number;
}

// Session Types
export type SessionStatus = 'waiting' | 'active' | 'ended';

export interface Session {
  id: string;
  quizId: string;
  quiz?: Quiz;
  status: SessionStatus;
  joinCode: string;
  currentRound: number;
  currentQuestion: number;
  questionStartTime: Date | null;
  isQuestionClosed: boolean;
  timerDuration: number; // in seconds
  autoCloseOnTimerEnd: boolean;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

// Player Types
export interface Player {
  id: string;
  sessionId: string;
  name: string;
  totalScore: number;
  joinedAt: Date;
}

// Answer Types
export interface Answer {
  id: string;
  sessionId: string;
  playerId: string;
  playerName: string;
  questionId: string;
  roundId: string;
  answerIndex: number;
  isCorrect: boolean;
  timestamp: Date;
  timeSpent: number; // in seconds
  pointsEarned: number;
}

// Statistics Types
export interface QuestionStatistics {
  questionId: string;
  timesAsked: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageTimeSpent: number;
}

export interface PlayerStatistics {
  playerId: string;
  playerName: string;
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageTimeSpent: number;
  accuracy: number; // percentage
}

// Leaderboard Types
export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  rank: number;
}

// Form Types
export interface QuizFormData {
  name: string;
  roundCount: number;
  questionsPerRound: number;
}

export interface QuestionFormData {
  text: string;
  answers: string[];
  correctIndex: number;
}

export interface SessionFormData {
  quizId: string;
  timerDuration: number;
  autoCloseOnTimerEnd: boolean;
}

// UI State Types
export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  duration: number;
}

