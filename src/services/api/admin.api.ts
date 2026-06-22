import { apiClient, type ApiResponse, type QueryParams } from "./client";

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
};
