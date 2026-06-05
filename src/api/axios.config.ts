// ─── Axios Configuration ─────────────────────────────────────────────────────
// Chịu trách nhiệm:
// 1. Tự động convert camelCase (FE) ↔ snake_case (BE) qua interceptors.
// 2. Tự động Refresh Token khi nhận lỗi 401 Unauthorized có mã hết hạn token.
// 3. Gửi Cookie HttpOnly qua withCredentials: true.

import axios from "axios";
import { HttpError } from "./http.type";
import { isPlainObject, mapKeys, mapValues, snakeCase, camelCase } from "lodash";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED";

// ── Helpers: case conversion ─────────────────────────────────────────────────

const shouldTransform = (obj: unknown): boolean => {
  if (obj === null || typeof obj !== "object") return false;
  if (!isPlainObject(obj)) return false;
  return !(
    obj instanceof Date ||
    obj instanceof File ||
    obj instanceof Blob ||
    obj instanceof FormData ||
    obj instanceof URLSearchParams
  );
};

const toCamel = <T>(obj: T): T => {
  if (Array.isArray(obj))
    return obj.map((item) => toCamel(item)) as unknown as T;
  if (shouldTransform(obj)) {
    return mapKeys(
      mapValues(obj as Record<string, unknown>, (v) => toCamel(v)),
      (_, k) => camelCase(k)
    ) as unknown as T;
  }
  return obj;
};

const toSnake = <T>(obj: T): T => {
  if (Array.isArray(obj))
    return obj.map((item) => toSnake(item)) as unknown as T;
  if (shouldTransform(obj)) {
    return mapKeys(
      mapValues(obj as Record<string, unknown>, (v) => toSnake(v)),
      (_, k) => snakeCase(k)
    ) as unknown as T;
  }
  return obj;
};

// ── Axios Instance ───────────────────────────────────────────────────────────

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Bắt buộc để gửi/nhận Cookie HttpOnly
  timeout: 30000,
});

// ── Token Refresh Queue ──────────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: { resolve: () => void; reject: (err: unknown) => void }[] =
  [];

const flushQueue = (error: unknown = null) => {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  refreshQueue = [];
};

// ── Request Interceptor (FE → BE: camelCase → snake_case) ────────────────────

axiosClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && !(config.data instanceof FormData)) {
    config.data = toSnake(config.data);
  }
  if (config.params) {
    config.params = toSnake(config.params);
  }
  return config;
});

// ── Response Interceptor (BE → FE: snake_case → camelCase & Auto Refresh) ────

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data) response.data = toCamel(response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || axios.isCancel(error)) return Promise.reject(error);

    // Lỗi mạng
    if (!error.response) {
      throw new HttpError({
        status: 0,
        message:
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
        code: "ERR_NETWORK",
      });
    }

    // Convert response data sang camelCase
    if (error.response.data) {
      error.response.data = toCamel(error.response.data);
    }

    const status = error.response.status;
    const responseData = error.response.data;
    const errorCode =
      responseData?.errorCode ?? responseData?.message ?? null;

    const isTokenExpired =
      typeof errorCode === "string" &&
      errorCode.endsWith(ACCESS_TOKEN_EXPIRED);

    // Xử lý 401 Unauthorized & Token Expired
    if (status === 401 && isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(() => axiosClient(originalRequest));
      }

      isRefreshing = true;

      try {
        // Dùng fetch native để tránh bị lặp vô hạn trong axios interceptor
        const refreshRes = await fetch(`${API_URL}/v1/auth/refresh-token`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!refreshRes.ok) throw new Error("Refresh token failed");

        flushQueue();
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        flushQueue(refreshErr);
        // Logout user và đẩy về trang login
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        throw new HttpError({
          status: 401,
          message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
          code: "REFRESH_TOKEN_FAILED",
        });
      } finally {
        isRefreshing = false;
      }
    }

    // Lỗi khác
    throw new HttpError({
      status,
      message: responseData?.message ?? "Đã xảy ra lỗi.",
      code: errorCode,
      errors: responseData?.errors,
    });
  }
);
