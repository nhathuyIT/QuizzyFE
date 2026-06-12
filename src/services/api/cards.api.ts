import { apiClient, type ApiResponse } from "./client";

export interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
  imageUrl?: string;
  examples: string[];
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardInput {
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
  imageUrl?: string;
  examples?: string[];
  position: number;
}

export const cardsAPI = {
  getAll: () => apiClient.get<ApiResponse<Card[]>>("/cards"),
  getById: (id: string) => apiClient.get<ApiResponse<Card>>(`/cards/${id}`),
  getByDeckId: (deckId: string) => apiClient.get<ApiResponse<Card[]>>(`/cards/deck/${deckId}`),
  create: (data: CardInput) => apiClient.post<ApiResponse<Card>>("/cards", data),
  bulkCreate: (cards: CardInput[]) => apiClient.post<ApiResponse<Card[]>>("/cards/bulk", { cards }),
};
