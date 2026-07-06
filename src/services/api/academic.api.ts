import { apiClient, type ApiResponse, type QueryParams } from "./client";

export interface Department {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  _id: string;
  code: string;
  name: string;
  departmentId: string;
  semester: number;
  documentCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AcademicDocumentFileType =
  | "pdf"
  | "docx"
  | "pptx"
  | "xlsx"
  | "other";

export type AcademicDocumentStatus = "active" | "archived";

export interface AcademicDocument {
  _id: string;
  title: string;
  description?: string;
  subjectId: string;
  uploadedBy: string | { _id: string; name: string; avatarUrl?: string };
  fileUrl: string;
  fileName: string;
  fileType: AcademicDocumentFileType;
  fileSize: number;
  storagePath: string;
  status: AcademicDocumentStatus;
  downloadCount: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuerySubjectsParams extends QueryParams {
  semester?: number;
}

export interface QueryDocumentsParams extends QueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  fileType?: AcademicDocumentFileType;
  status?: AcademicDocumentStatus | "all";
}

export interface CreateDocumentInput {
  title: string;
  description?: string;
  subjectId: string;
  fileUrl: string;
  fileName: string;
  fileType: AcademicDocumentFileType;
  fileSize: number;
  storagePath: string;
  tags?: string[];
}

export const academicAPI = {
  getDepartments: () =>
    apiClient.get<ApiResponse<Department[]>>("/academic/departments"),

  getSubjects: (deptId: string, params?: QuerySubjectsParams) =>
    apiClient.get<ApiResponse<Subject[]>>(
      `/academic/departments/${deptId}/subjects`,
      params,
    ),

  getDocumentsBySubject: (subjectId: string, params?: QueryDocumentsParams) =>
    apiClient.get<
      ApiResponse<{
        data: AcademicDocument[];
        meta: any;
      }>
    >(`/academic/subjects/${subjectId}/documents`, params),

  getMyDocuments: (params?: QueryDocumentsParams) =>
    apiClient.get<
      ApiResponse<{
        data: AcademicDocument[];
        meta: any;
      }>
    >("/academic/documents/my", params),

  createDocument: (data: CreateDocumentInput) =>
    apiClient.post<ApiResponse<AcademicDocument>>("/academic/documents", data),

  deleteDocument: (id: string) =>
    apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/academic/documents/${id}`,
    ),

  incrementDownloadCount: (id: string) =>
    apiClient.patch<ApiResponse<{ success: boolean }>>(
      `/academic/documents/${id}/download-count`,
      {},
    ),
};
