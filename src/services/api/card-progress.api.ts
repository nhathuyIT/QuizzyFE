import { apiClient, type ApiResponse } from "./client";

export type ProgressStatus = "new" | "learning" | "review" | "mastered";

export interface CardProgress {
  _id: string;
  userId: string;
  cardId: string;
  deckId: string;
  mastery: number;
  status: ProgressStatus;
  easeFactor: number;
  intervalDays: number;
  dueAt: string;
  correctCount: number;
  wrongCount: number;
}

export interface DeckProgressSummary {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
  dueToday: number;
}

export interface ProgressInput {
  cardId: string;
  deckId: string;
  mastery?: number;
  status?: ProgressStatus;
  easeFactor?: number;
  intervalDays?: number;
  dueAt: string;
  correctCount?: number;
  wrongCount?: number;
}

export const cardProgressAPI = {
  upsert: (data: ProgressInput) => apiClient.put<ApiResponse<CardProgress>>("/card-progress", data),
  getDueCards: (deckId: string) => apiClient.get<ApiResponse<CardProgress[]>>(`/card-progress/decks/${deckId}/due`),
  getDeckSummary: (deckId: string) => apiClient.get<ApiResponse<DeckProgressSummary>>(`/card-progress/decks/${deckId}/summary`),
};
