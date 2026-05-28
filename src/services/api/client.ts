export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiClientRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        url.searchParams.set(k, String(v));
      });
    }
    return url.toString();
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    options?: ApiClientRequestOptions
  ): Promise<T> {
    const { headers, body, params } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (data as { message?: string })?.message ?? `HTTP ${response.status}`;
      throw new ApiError(message, response.status, data);
    }

    return data as T;
  }

  get<T>(
    endpoint: string,
    options?: Omit<ApiClientRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>("GET", endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options?: Omit<ApiClientRequestOptions, "method">
  ): Promise<T> {
    return this.request<T>("POST", endpoint, { ...options, body, method: "POST" });
  }

  put<T>(
    endpoint: string,
    body: unknown,
    options?: Omit<ApiClientRequestOptions, "method">
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, { ...options, body, method: "PUT" });
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    options?: Omit<ApiClientRequestOptions, "method">
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, {
      ...options,
      body,
      method: "PATCH",
    });
  }

  delete<T>(
    endpoint: string,
    options?: Omit<ApiClientRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>("DELETE", endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
});

export { ApiClient };
