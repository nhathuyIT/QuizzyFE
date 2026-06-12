import { apiClient, type ApiResponse } from "./client";
import type { CardProgress } from "./card-progress.api";

export type StudyMode = "flashcard" | "learn" | "test" | "match";

export interface StudySessionStats {
  correct: number;
  wrong: number;
  skipped: number;
  timeSpentSec: number;
}

export interface StudySession {
  _id: string;
  userId: string;
  deckId: string;
  mode: StudyMode;
  startedAt: string;
  finishedAt?: string;
  stats: StudySessionStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewResult {
  reviewId: string;
  cardId: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  progressUpdate: Pick<CardProgress, "status" | "mastery" | "easeFactor" | "intervalDays" | "dueAt">;
}

export const studyAPI = {
  createSession: (deckId: string, mode: StudyMode) => apiClient.post<ApiResponse<StudySession>>("/study/sessions", { deckId, mode }),
  logReview: (sessionId: string, cardId: string, userAnswer: string) => apiClient.post<ApiResponse<ReviewResult>>("/study/reviews", { sessionId, cardId, userAnswer }),
  finishSession: (sessionId: string) => apiClient.patch<ApiResponse<StudySession>>(`/study/sessions/${sessionId}/finish`),
  getSessions: () => apiClient.get<ApiResponse<StudySession[]>>("/study/sessions"),
  getSession: (sessionId: string) => apiClient.get<ApiResponse<StudySession>>(`/study/sessions/${sessionId}`),
};
