export interface Department {
  _id: string;
  code: "AI" | "SE";
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  _id: string;
  code: string;
  name: string;
  departmentId: string;
  semester: number;
  documentCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FileType = "pdf" | "docx" | "pptx" | "xlsx" | "other";
export type DocumentStatus = "active" | "archived";

export interface AcademicDocument {
  _id: string;
  title: string;
  description?: string;
  subjectId: string;
  uploadedBy: string;
  fileUrl: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  storagePath: string;
  status: DocumentStatus;
  downloadCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  subjectId: string;
  fileUrl: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  storagePath: string;
  tags?: string[];
}

export interface QueryDocumentsParams {
  page?: number;
  limit?: number;
  take?: number;
  keyword?: string;
  fileType?: FileType;
  status?: DocumentStatus | "all";
}
