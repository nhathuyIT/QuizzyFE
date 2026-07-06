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

export interface AdminStudySessionQueryDto extends QueryParams {
  page?: number;
  take?: number;
  userId?: string;
  deckId?: string;
  mode?: "flashcard" | "learn" | "test" | "match";
  status?: "finished" | "unfinished";
  from?: string;
  to?: string;
}

export interface AdminStudySummaryQueryDto extends QueryParams {
  from?: string;
  to?: string;
  mode?: "flashcard" | "learn" | "test" | "match";
}

export interface AdminAuditLog {
  _id: string;
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: any;
  createdAt: string;
}

export interface AdminAuditLogQueryDto extends QueryParams {
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
  getStudySummary: (params: AdminStudySummaryQueryDto = {}) =>
    apiClient.get<ApiResponse<any>>("/admin/study/summary", params),
  getStudySessions: (params: AdminStudySessionQueryDto = {}) =>
    apiClient.get<ApiResponse<{ data: StudySession[]; meta: any }>>("/admin/study-sessions", params),
  getStudySession: (sessionId: string) =>
    apiClient.get<ApiResponse<StudySession>>(`/admin/study-sessions/${sessionId}`),
  getStudySessionReviews: (sessionId: string, params: QueryParams = {}) =>
    apiClient.get<ApiResponse<{ data: ReviewResult[]; meta: any }>>(`/admin/study-sessions/${sessionId}/reviews`, params),

  // Audit Logs
  getAuditLogs: (params: AdminAuditLogQueryDto = {}) =>
    apiClient.get<ApiResponse<{ data: AdminAuditLog[]; meta: any }>>("/admin/audit-logs", params),
};
