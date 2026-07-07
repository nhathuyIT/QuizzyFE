import { apiClient, type ApiResponse, type QueryParams } from "./client";
import type { Deck } from "./decks.api";
import type { StudySession, ReviewResult } from "./study.api";

export type AdminActivityInterval = "day" | "week" | "month";
export type AdminUserRole = "student" | "teacher" | "admin";
export type AdminUserStatus = "active" | "suspended" | "deleted" | string;

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

export interface AdminUpdateUserRoleInput {
  role: AdminUserRole;
}

export interface AdminUpdateUserStatusInput {
  status: Exclude<AdminUserStatus, "deleted">;
  reason?: string;
}

export interface AdminDeckQueryDto extends QueryParams {
  page?: number;
  take?: number;
  keyword?: string;
  visibility?: "private" | "link" | "public";
  moderationStatus?: "active" | "hidden" | "deleted";
  ownerId?: string;
}

export interface AdminModerateDeckInput {
  status: "active" | "hidden";
  reason?: string;
}

export interface AdminStudySummary {
  from: string;
  to: string;
  mode: string;
  sessions: number;
  activeUsers: number;
  reviews: number;
  accuracy: number;
  completionRate: number;
  averageStudyTimeSeconds: number;
}

export interface AdminStudySession {
  _id?: string;
  id?: string;
  userId: string;
  deckId: string;
  mode: string;
  startedAt: string;
  finishedAt: string | null;
  user?: {
    _id?: string;
    email: string;
    name: string;
  };
  deck?: {
    _id?: string;
    title: string;
  };
  reviewCount?: number;
  correctReviewCount?: number;
}

export interface AdminStudySessionSearchParams extends QueryParams {
  page?: number;
  take?: number;
  userId?: string;
  deckId?: string;
  mode?: string;
  status?: "finished" | "unfinished";
  from?: string;
  to?: string;
}

export interface AdminStudySummarySearchParams extends QueryParams {
  from?: string;
  to?: string;
  mode?: string;
}

export interface AdminCardReview {
  _id?: string;
  id?: string;
  cardId: string;
  isCorrect: boolean;
  rating: string;
  responseTimeMs: number;
  answer?: string;
  createdAt: string;
  card?: {
    _id?: string;
    front: string;
    back: string;
    type?: string;
  };
}

export interface AdminStudySessionReviewSearchParams extends QueryParams {
  page?: number;
  take?: number;
}

export interface AdminAuditLog {
  _id?: string;
  id?: string;
  adminId: string;
  action: string;
  targetType: "user" | "deck";
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  admin?: {
    _id?: string;
    email: string;
    name: string;
  };
}

export interface AdminAuditLogSearchParams extends QueryParams {
  page?: number;
  take?: number;
  adminId?: string;
  action?: string;
  from?: string;
  to?: string;
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

  // Decks
  getDecks: (params: AdminDeckQueryDto = {}) =>
    apiClient.get<ApiResponse<{ data: Deck[]; meta: any }>>("/admin/decks", params),
  getDeck: (deckId: string) =>
    apiClient.get<ApiResponse<Deck>>(`/admin/decks/${deckId}`),
  moderateDeck: (deckId: string, data: AdminModerateDeckInput) =>
    apiClient.patch<ApiResponse<Deck>>(`/admin/decks/${deckId}/moderation`, data),
  deleteDeck: (deckId: string) =>
    apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/admin/decks/${deckId}`),
  restoreDeck: (deckId: string) =>
    apiClient.post<ApiResponse<Deck>>(`/admin/decks/${deckId}/restore`, {}),

  // Study
  getStudySummary: (params: AdminStudySummarySearchParams = {}) =>
    apiClient.get<ApiResponse<AdminStudySummary>>("/admin/study/summary", { ...params }),
  getStudySessions: (params: AdminStudySessionSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminStudySession[]>>("/admin/study-sessions", { ...params }),
  getStudySession: (sessionId: string) =>
    apiClient.get<ApiResponse<AdminStudySession>>(`/admin/study-sessions/${sessionId}`),
  getStudySessionReviews: (sessionId: string, params: AdminStudySessionReviewSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminCardReview[]>>(`/admin/study-sessions/${sessionId}/reviews`, { ...params }),

  // Audit Logs
  getAuditLogs: (params: AdminAuditLogSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminAuditLog[]>>("/admin/audit-logs", { ...params }),
};
