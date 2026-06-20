import { apiClient, type ApiResponse } from "./client";
import type { CardProgress } from "./card-progress.api";

export type StudyMode = "flashcard" | "learn" | "test" | "match";
export type ReviewRating = "again" | "hard" | "good" | "easy";

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

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface FlashcardStudyItem {
  cardId: string;
  type: "flashcard";
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
  imageUrl?: string;
}

export interface WrittenStudyItem {
  cardId: string;
  questionId?: string;
  type: "written";
  prompt: string;
  hint?: string;
  correctAnswer?: string;
  options?: ChoiceOption[];
}

export interface MultipleChoiceStudyItem {
  cardId: string;
  questionId: string;
  type: "multiple_choice";
  prompt: string;
  options: ChoiceOption[];
  correctAnswer?: string;
}

export interface MatchStudyItem {
  tileId: string;
  cardId: string;
  side: "front" | "back";
  text: string;
}

export type StudyItem =
  | FlashcardStudyItem
  | WrittenStudyItem
  | MultipleChoiceStudyItem
  | MatchStudyItem;

export interface LogReviewInput {
  sessionId: string;
  cardId: string;
  userAnswer?: string;
  rating?: ReviewRating;
  responseTimeMs?: number;
  clientReviewId?: string;
}

export interface ReviewResult {
  reviewId: string;
  cardId: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  progressUpdate: Pick<
    CardProgress,
    "status" | "mastery" | "easeFactor" | "intervalDays" | "dueAt"
  >;
}

export interface SyncReviewsResult {
  synced: number;
  skipped: number;
  results: ReviewResult[];
}

export const studyAPI = {
  createSession: (deckId: string, mode: StudyMode) =>
    apiClient.post<ApiResponse<StudySession>>("/study/sessions", {
      deckId,
      mode,
    }),
  getSessionItems: (sessionId: string) =>
    apiClient.get<ApiResponse<StudyItem[]>>(`/study/sessions/${sessionId}/items`),
  logReview: (data: LogReviewInput) =>
    apiClient.post<ApiResponse<ReviewResult>>("/study/reviews", data),
  syncReviews: (data: LogReviewInput[]) =>
    apiClient.post<ApiResponse<SyncReviewsResult>>("/study/reviews/sync", data),
  finishSession: (sessionId: string) =>
    apiClient.patch<ApiResponse<StudySession>>(
      `/study/sessions/${sessionId}/finish`,
    ),
  getSessions: () => apiClient.get<ApiResponse<StudySession[]>>("/study/sessions"),
  getSession: (sessionId: string) =>
    apiClient.get<ApiResponse<StudySession>>(`/study/sessions/${sessionId}`),
};
