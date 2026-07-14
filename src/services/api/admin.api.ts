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

export type AdminAcademicEntityStatus = "active" | "inactive" | "all";
export type AdminAcademicDocumentStatus =
  | "pending"
  | "active"
  | "rejected"
  | "archived";
export type AdminAcademicDocumentFileType =
  | "pdf"
  | "docx"
  | "pptx"
  | "xlsx"
  | "other";

export interface AdminAcademicDepartment {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface AdminAcademicSubject {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  departmentId: string | AdminAcademicDepartment;
  semester: number;
  documentCount?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface AdminAcademicDocumentUploader {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface AdminAcademicDocument {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  subjectId: string | AdminAcademicSubject;
  uploadedBy: string | AdminAcademicDocumentUploader;
  fileUrl: string;
  fileName: string;
  fileType: AdminAcademicDocumentFileType;
  fileSize: number;
  storagePath?: string;
  status: AdminAcademicDocumentStatus;
  downloadCount?: number;
  tags: string[];
  reviewNote?: string;
  note?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface AdminAcademicDepartmentSearchParams extends QueryParams {
  page?: number;
  take?: number;
  status?: AdminAcademicEntityStatus;
  keyword?: string;
}

export interface AdminCreateAcademicDepartmentInput {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface AdminUpdateAcademicDepartmentInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface AdminAcademicSubjectSearchParams extends QueryParams {
  page?: number;
  take?: number;
  status?: AdminAcademicEntityStatus;
  departmentId?: string;
  semester?: number;
  keyword?: string;
}

export interface AdminCreateAcademicSubjectInput {
  code: string;
  name: string;
  departmentId: string;
  semester: number;
  isActive: boolean;
}

export interface AdminUpdateAcademicSubjectInput {
  code?: string;
  name?: string;
  semester?: number;
  isActive?: boolean;
}

export interface AdminAcademicDocumentSearchParams extends QueryParams {
  page?: number;
  take?: number;
  status?: AdminAcademicDocumentStatus | "all";
  departmentId?: string;
  subjectId?: string;
  uploaderId?: string;
  fileType?: AdminAcademicDocumentFileType;
  keyword?: string;
}

export interface AdminUpdateAcademicDocumentInput {
  title?: string;
  description?: string;
  subjectId?: string;
  tags?: string[];
}

export interface AdminReviewAcademicDocumentInput {
  status: Extract<
    AdminAcademicDocumentStatus,
    "pending" | "active" | "rejected"
  >;
  note?: string;
}

type AdminListPayload<T> =
  | T[]
  | {
      data: T[];
      meta?: PageMeta;
    };

async function getAdminList<T>(
  endpoint: string,
  params: QueryParams,
): Promise<ApiResponse<T[]>> {
  const response = await apiClient.get<ApiResponse<AdminListPayload<T>>>(
    endpoint,
    params,
  );
  const nestedPayload = Array.isArray(response.data)
    ? undefined
    : response.data;

  return {
    ...response,
    data: Array.isArray(response.data) ? response.data : response.data.data,
    meta: nestedPayload?.meta ?? response.meta,
  };
}

export const adminAPI = {
  getDashboardSummary: () =>
    apiClient.get<ApiResponse<AdminDashboardSummary>>(
      "/admin/dashboard/summary",
    ),
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
    apiClient.patch<ApiResponse<AdminUser>>(
      `/admin/users/${userId}/role`,
      data,
    ),
  updateUserStatus: (userId: string, data: AdminUpdateUserStatusInput) =>
    apiClient.patch<ApiResponse<AdminUser>>(
      `/admin/users/${userId}/status`,
      data,
    ),
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
    apiClient.post<ApiResponse<AdminUser>>(
      `/admin/users/${userId}/restore`,
      {},
    ),

  // Decks
  getDecks: (params: AdminDeckSearchParams = {}) =>
    getAdminList<AdminDeck>("/admin/decks", params),
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

  // Study
  getStudySummary: (params: AdminStudySummarySearchParams = {}) =>
    apiClient.get<ApiResponse<AdminStudySummary>>("/admin/study/summary", {
      ...params,
    }),
  getStudySessions: (params: AdminStudySessionSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminStudySession[]>>("/admin/study-sessions", {
      ...params,
    }),
  getStudySession: (sessionId: string) =>
    apiClient.get<ApiResponse<AdminStudySession>>(
      `/admin/study-sessions/${sessionId}`,
    ),
  getStudySessionReviews: (
    sessionId: string,
    params: AdminStudySessionReviewSearchParams = {},
  ) =>
    apiClient.get<ApiResponse<AdminCardReview[]>>(
      `/admin/study-sessions/${sessionId}/reviews`,
      { ...params },
    ),

  // Audit Logs
  getAuditLogs: (params: AdminAuditLogSearchParams = {}) =>
    apiClient.get<ApiResponse<AdminAuditLog[]>>("/admin/audit-logs", {
      ...params,
    }),

  // Academic Management - Departments
  getAcademicDepartments: (params: AdminAcademicDepartmentSearchParams = {}) =>
    getAdminList<AdminAcademicDepartment>(
      "/admin/academic/departments",
      params,
    ),
  createAcademicDepartment: (data: AdminCreateAcademicDepartmentInput) =>
    apiClient.post<ApiResponse<AdminAcademicDepartment>>(
      "/admin/academic/departments",
      data,
    ),
  updateAcademicDepartment: (
    departmentId: string,
    data: AdminUpdateAcademicDepartmentInput,
  ) =>
    apiClient.patch<ApiResponse<AdminAcademicDepartment>>(
      `/admin/academic/departments/${departmentId}`,
      data,
    ),
  deactivateAcademicDepartment: (departmentId: string) =>
    apiClient.delete<ApiResponse<AdminAcademicDepartment>>(
      `/admin/academic/departments/${departmentId}`,
    ),
  restoreAcademicDepartment: (departmentId: string) =>
    apiClient.post<ApiResponse<AdminAcademicDepartment>>(
      `/admin/academic/departments/${departmentId}/restore`,
      {},
    ),

  // Academic Management - Subjects
  getAcademicSubjects: (params: AdminAcademicSubjectSearchParams = {}) =>
    getAdminList<AdminAcademicSubject>(
      "/admin/academic/subjects",
      params,
    ),
  createAcademicSubject: (data: AdminCreateAcademicSubjectInput) =>
    apiClient.post<ApiResponse<AdminAcademicSubject>>(
      "/admin/academic/subjects",
      data,
    ),
  updateAcademicSubject: (
    subjectId: string,
    data: AdminUpdateAcademicSubjectInput,
  ) =>
    apiClient.patch<ApiResponse<AdminAcademicSubject>>(
      `/admin/academic/subjects/${subjectId}`,
      data,
    ),
  deactivateAcademicSubject: (subjectId: string) =>
    apiClient.delete<ApiResponse<AdminAcademicSubject>>(
      `/admin/academic/subjects/${subjectId}`,
    ),
  restoreAcademicSubject: (subjectId: string) =>
    apiClient.post<ApiResponse<AdminAcademicSubject>>(
      `/admin/academic/subjects/${subjectId}/restore`,
      {},
    ),

  // Academic Management - Document Review
  getAcademicDocuments: (params: AdminAcademicDocumentSearchParams = {}) =>
    getAdminList<AdminAcademicDocument>(
      "/admin/academic/documents",
      params,
    ),
  getAcademicDocument: (documentId: string) =>
    apiClient.get<ApiResponse<AdminAcademicDocument>>(
      `/admin/academic/documents/${documentId}`,
    ),
  updateAcademicDocument: (
    documentId: string,
    data: AdminUpdateAcademicDocumentInput,
  ) =>
    apiClient.patch<ApiResponse<AdminAcademicDocument>>(
      `/admin/academic/documents/${documentId}`,
      data,
    ),
  reviewAcademicDocument: (
    documentId: string,
    data: AdminReviewAcademicDocumentInput,
  ) =>
    apiClient.patch<ApiResponse<AdminAcademicDocument>>(
      `/admin/academic/documents/${documentId}/review`,
      data,
    ),
  archiveAcademicDocument: (documentId: string) =>
    apiClient.delete<ApiResponse<AdminAcademicDocument>>(
      `/admin/academic/documents/${documentId}`,
    ),
  restoreAcademicDocument: (documentId: string) =>
    apiClient.post<ApiResponse<AdminAcademicDocument>>(
      `/admin/academic/documents/${documentId}/restore`,
      {},
    ),
};
