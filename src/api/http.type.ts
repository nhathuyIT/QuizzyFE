// ─── Core HTTP Types ─────────────────────────────────────────────────────────
// Chuẩn hóa interface cho Request, Response và lớp quản lý lỗi HttpError.

export interface HttpRequestConfig<
  TData = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>,
> {
  url: string;
  data?: TData;
  params?: TParams;
  headers?: Record<string, string>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T | null;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ApiErrorItem {
  message: string;
  field?: string;
}

export class HttpError extends Error {
  status: number;
  code?: string;
  errors?: ApiErrorItem[];

  constructor(params: {
    status: number;
    message: string;
    code?: string;
    errors?: ApiErrorItem[];
  }) {
    super(params.message);
    this.name = "HttpError";
    this.status = params.status;
    this.code = params.code;
    this.errors = params.errors;
  }
}
