import { apiClient } from "./client";

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  q: string;
  opts: string[];
  correct: number;
}

export interface Deck {
  id: string;
  name: string;
  subject: string;
  cardCount: number;
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  deckCount: string;
  bg: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "teams";
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  streak: number;
  completedAt: string;
}

export const quizApi = {
  getQuizzes: () => apiClient.get<Quiz[]>("/api/quizzes"),

  getQuizById: (id: string) => apiClient.get<Quiz>(`/api/quizzes/${id}`),

  submitAttempt: (data: QuizAttempt) =>
    apiClient.post<QuizAttempt>("/api/attempts", data),

  getDecks: () => apiClient.get<Deck[]>("/api/decks"),

  getSubjects: () => apiClient.get<Subject[]>("/api/subjects"),
};

export const userApi = {
  getMe: () => apiClient.get<User>("/api/users/me"),

  updateProfile: (data: Partial<User>) =>
    apiClient.patch<User>("/api/users/me", data),
};
