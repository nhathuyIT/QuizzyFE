import { axiosClient, withApiVersion } from "@/api/axios.config";

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PageMeta;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const cleanParams = (params?: QueryParams) => {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== "" && value !== undefined && value !== null;
    }),
  );
};

async function request<T>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  params?: QueryParams,
): Promise<T> {
  const response = await axiosClient.request<T>({
    method,
    url: withApiVersion(endpoint),
    data: body,
    params: cleanParams(params),
  });

  return response.data;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: QueryParams) =>
    request<T>("GET", endpoint, undefined, params),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>("PUT", endpoint, body),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>("PATCH", endpoint, body),
  delete: <T>(endpoint: string, params?: QueryParams) =>
    request<T>("DELETE", endpoint, undefined, params),
};
