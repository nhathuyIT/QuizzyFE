const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const API_BASE_URL = `${configuredApiUrl.replace(/\/$/, "").replace(/\/v1$/, "")}/v1`;

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

export type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(endpoint: string, params?: QueryParams) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object" || !("message" in payload)) return fallback;
  const message = (payload as { message?: unknown }).message;
  return Array.isArray(message) ? message.join(". ") : typeof message === "string" ? message : fallback;
}

async function request<T>(method: string, endpoint: string, body?: unknown, params?: QueryParams): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = new Headers();
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(buildUrl(endpoint, params), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("quizzy:unauthorized"));
    }
    throw new ApiError(extractErrorMessage(payload, response.statusText || "Request failed"), response.status, payload);
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: QueryParams) => request<T>("GET", endpoint, undefined, params),
  post: <T>(endpoint: string, body: unknown) => request<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body: unknown) => request<T>("PUT", endpoint, body),
  patch: <T>(endpoint: string, body?: unknown) => request<T>("PATCH", endpoint, body),
};
