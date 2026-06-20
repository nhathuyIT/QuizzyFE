import { apiClient, type ApiResponse } from "./client";

export type DeckVisibility = "private" | "link" | "public";

export interface Deck {
  _id: string;
  title: string;
  description?: string;
  visibility: DeckVisibility;
  tags: string[];
  cardCount: number;
  createdBy: string;
  star?: boolean;
  sourceType: "manual" | "ai";
  lastStudiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeckInput {
  title: string;
  description?: string;
  visibility?: DeckVisibility;
  tags?: string[];
}

export interface DeckSearchParams {
  keyword?: string;
  visibility?: DeckVisibility;
  order?: "ASC" | "DESC";
  page?: number;
  take?: number;
}

export const decksAPI = {
  search: (params: DeckSearchParams = {}) => apiClient.get<ApiResponse<Deck[]>>("/decks", { ...params }),
  getAll: () => apiClient.get<ApiResponse<Deck[]>>("/decks", { take: 100 }),
  getMy: (params: DeckSearchParams = {}) => apiClient.get<ApiResponse<Deck[]>>("/decks/my", { ...params }),
  getStarred: (params: DeckSearchParams = {}) => apiClient.get<ApiResponse<Deck[]>>("/decks/starred", { ...params }),
  getById: (id: string) => apiClient.get<ApiResponse<Deck>>(`/decks/${id}`),
  create: (data: DeckInput) => apiClient.post<ApiResponse<Deck>>("/decks", data),
  update: (id: string, data: Partial<DeckInput>) => apiClient.patch<ApiResponse<Deck>>(`/decks/${id}`, data),
  star: (id: string) => apiClient.put<ApiResponse<Deck>>(`/decks/${id}/star`, {}),
  unstar: (id: string) => apiClient.delete<ApiResponse<Deck>>(`/decks/${id}/star`),
};
