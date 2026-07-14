import { apiClient, type ApiResponse } from "./client";
import type {
  AcademicDocument,
  CreateDocumentDto,
  Department,
  QueryDocumentsParams,
  Subject,
} from "@/types/academic.type";

export const academicApi = {
  getDepartments: () =>
    apiClient.get<ApiResponse<Department[]>>("/academic/departments"),

  getSubjectsByDepartment: (departmentId: string, semester?: number) =>
    apiClient.get<ApiResponse<Subject[]>>(
      `/academic/departments/${departmentId}/subjects`,
      { semester },
    ),

  getSubjectDocuments: (subjectId: string, params: QueryDocumentsParams = {}) =>
    apiClient.get<ApiResponse<AcademicDocument[]>>(
      `/academic/subjects/${subjectId}/documents`,
      { ...params },
    ),

  getMyDocuments: (params: QueryDocumentsParams = {}) =>
    apiClient.get<ApiResponse<AcademicDocument[]>>("/academic/documents/my", {
      ...params,
    }),

  createDocumentMetadata: (body: CreateDocumentDto) =>
    apiClient.post<ApiResponse<AcademicDocument>>("/academic/documents", body),

  deleteDocument: (id: string) =>
    apiClient.delete<ApiResponse<AcademicDocument>>(
      `/academic/documents/${id}`,
    ),

  incrementDownloadCount: (id: string) =>
    apiClient.patch<ApiResponse<{ success: boolean }>>(
      `/academic/documents/${id}/download-count`,
    ),
};

export const academicAPI = {
  ...academicApi,
  getSubjects: academicApi.getSubjectsByDepartment,
  getDocumentsBySubject: academicApi.getSubjectDocuments,
  createDocument: academicApi.createDocumentMetadata,
};
