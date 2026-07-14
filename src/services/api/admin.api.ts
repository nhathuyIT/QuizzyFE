import {
  apiClient,
  type ApiResponse,
  type PageMeta,
  type QueryParams,
} from "./client";

export type AdminActivityInterval = "day" | "week" | "month";
export type AdminUserRole = "student" | "teacher" | "admin";
export type AdminUserStatus = "active" | "suspended" | "deleted" | string;
export type AdminDeckVisibility = "private" | "link" | "public";
export type AdminDeckModerationStatus = "active" | "hidden" | "deleted";

export interface AdminDashboardTotals {
  users: number;
  decks: number;
  cards: number;
  sessions: number;
  reviews: number;
}

export interface AdminDashboardRange {
  from: string;
  to: string;
  newUsers: number;
  activeUsers: number;
  reviews: number;
  sessions: number;
}

export interface AdminDashboardSummary {
  totals: AdminDashboardTotals;
  range: AdminDashboardRange;
  dau: number;
  wau: number;
  mau: number;
  accuracy: number;
  sessionCompletionRate: number;
  averageStudyTimeSeconds: number;
}

export interface AdminActivityPoint {
  period: string;
  newUsers: number;
  activeUsers: number;
  sessions: number;
  reviews: number;
  accuracy: number;
}

export interface AdminActivityAnalytics {
  interval: AdminActivityInterval;
  from: string;
  to: string;
  series: AdminActivityPoint[];
}

export interface AdminUser {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  role: AdminUserRole;
  status?: AdminUserStatus;
  avatarUrl?: string;
  totalPoints?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface AdminUserSearchParams extends QueryParams {
  page?: number;
  take?: number;
  keyword?: string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
}

export interface AdminDeckOwner {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  role?: AdminUserRole;
}

export interface AdminDeckCard {
  _id?: string;
  id?: string;
  front?: string;
  back?: string;
  createdAt?: string;
}

export interface AdminDeckMetrics {
  sessionCount: number;
  learnerCount: number;
  completionRate: number;
  reviewCount: number;
  accuracy: number;
}

export interface AdminDeck {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  visibility: AdminDeckVisibility;
  createdBy?: string;
  owner?: AdminDeckOwner;
  sourceType?: "manual" | "ai";
  tags?: string[];
  cardCount?: number;
  lastStudiedAt?: string;
  moderationStatus?: Exclude<AdminDeckModerationStatus, "deleted">;
  moderationReason?: string;
  moderatedAt?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  metrics?: AdminDeckMetrics;
  cards?: {
    data: AdminDeckCard[];
    meta?: PageMeta;
  };
}

export interface AdminDeckSearchParams extends QueryParams {
  page?: number;
  take?: number;
  keyword?: string;
  visibility?: AdminDeckVisibility;
  moderationStatus?: AdminDeckModerationStatus;
  ownerId?: string;
}

export interface AdminCreateDeckInput {
  title: string;
  description?: string;
  visibility?: AdminDeckVisibility;
  tags?: string[];
  ownerId: string;
}

export interface AdminUpdateDeckInput {
  title?: string;
  description?: string;
  visibility?: AdminDeckVisibility;
  tags?: string[];
  ownerId?: string;
}

export interface AdminModerateDeckInput {
  status: Exclude<AdminDeckModerationStatus, "deleted">;
  reason?: string;
}

export interface AdminUpdateUserRoleInput {
  role: AdminUserRole;
}

export interface AdminUpdateUserStatusInput {
  status: Exclude<AdminUserStatus, "deleted">;
  reason?: string;
}

export const adminAPI = {
  getDashboardSummary: () =>
    apiClient.get<ApiResponse<AdminDashboardSummary>>("/admin/dashboard/summary"),
  getActivityAnalytics: (interval: AdminActivityInterval = "day") =>
    apiClient.get<ApiResponse<AdminActivityAnalytics>>(
      "/admin/analytics/activity",
      { interval },
    ),
  getUsers: (params: AdminUserSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminUser[]>>("/admin/users", { ...params }),
  getUser: (userId: string) =>
    apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${userId}`),
  updateUserRole: (userId: string, data: AdminUpdateUserRoleInput) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/role`, data),
  updateUserStatus: (userId: string, data: AdminUpdateUserStatusInput) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/status`, data),
  suspendUser: (userId: string, reason?: string) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/status`, {
      status: "suspended",
      reason,
    }),
  activateUser: (userId: string) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/status`, {
      status: "active",
    }),
  revokeUserSessions: (userId: string) =>
    apiClient.post<ApiResponse<{ revoked: boolean }>>(
      `/admin/users/${userId}/revoke-sessions`,
      {},
    ),
  deleteUser: (userId: string) =>
    apiClient.delete<ApiResponse<AdminUser>>(`/admin/users/${userId}`),
  restoreUser: (userId: string) =>
    apiClient.post<ApiResponse<AdminUser>>(`/admin/users/${userId}/restore`, {}),
  getDecks: (params: AdminDeckSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminDeck[]>>("/admin/decks", { ...params }),
  getDeck: (deckId: string, params: QueryParams = {}) =>
    apiClient.get<ApiResponse<AdminDeck>>(`/admin/decks/${deckId}`, {
      ...params,
    }),
  createDeck: (data: AdminCreateDeckInput) =>
    apiClient.post<ApiResponse<AdminDeck>>("/admin/decks", data),
  updateDeck: (deckId: string, data: AdminUpdateDeckInput) =>
    apiClient.patch<ApiResponse<AdminDeck>>(`/admin/decks/${deckId}`, data),
  moderateDeck: (deckId: string, data: AdminModerateDeckInput) =>
    apiClient.patch<ApiResponse<AdminDeck>>(
      `/admin/decks/${deckId}/moderation`,
      data,
    ),
  deleteDeck: (deckId: string) =>
    apiClient.delete<ApiResponse<AdminDeck>>(`/admin/decks/${deckId}`),
  restoreDeck: (deckId: string) =>
    apiClient.post<ApiResponse<AdminDeck>>(`/admin/decks/${deckId}/restore`, {}),
};
