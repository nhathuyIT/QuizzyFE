import axios, { type AxiosError } from "axios";
import { HttpError, type ApiErrorItem } from "./http.type";

const DEFAULT_API_URL = "http://localhost:3001";

export const API_VERSION_PREFIX = "/v1";

type NestErrorResponse = {
  message?: string | string[];
  error?: string;
  errorCode?: string;
  statusCode?: number;
  errors?: ApiErrorItem[];
};

export const normalizeApiBaseUrl = (url: string) =>
  url.trim().replace(/\/+$/, "").replace(/\/v1$/, "");

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
);

export const withApiVersion = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (
    normalizedPath === API_VERSION_PREFIX ||
    normalizedPath.startsWith(`${API_VERSION_PREFIX}/`)
  ) {
    return normalizedPath;
  }

  return `${API_VERSION_PREFIX}${normalizedPath}`;
};

const getBrowserAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
};

const handleUnauthorized = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("accessToken");
  window.dispatchEvent(new Event("quizzy:auth-changed"));
  window.dispatchEvent(new Event("quizzy:unauthorized"));
};

const extractMessage = (
  payload: NestErrorResponse | undefined,
  fallback: string,
) => {
  const message = payload?.message;

  if (Array.isArray(message)) {
    const joinedMessage = message.filter(Boolean).join(". ");
    return joinedMessage || fallback;
  }

  return typeof message === "string" && message.trim() ? message : fallback;
};

const extractErrors = (payload: NestErrorResponse | undefined) => {
  if (Array.isArray(payload?.errors)) return payload.errors;
  if (!Array.isArray(payload?.message)) return undefined;

  return payload.message.map((message) => ({ message }));
};

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getBrowserAccessToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<NestErrorResponse>) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (!error.response) {
      throw new HttpError({
        status: 0,
        message:
          "Khong the ket noi den may chu. Vui long kiem tra ket noi mang.",
        code: "ERR_NETWORK",
      });
    }

    const { data, status, statusText } = error.response;

    if (status === 401) {
      handleUnauthorized();
    }

    throw new HttpError({
      status,
      message: extractMessage(data, statusText || "Request failed"),
      code:
        data?.errorCode ?? data?.error ?? String(data?.statusCode ?? status),
      errors: extractErrors(data),
    });
  },
);
