import { apiClient, type ApiResponse } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  avatarUrl?: string;
  totalPoints: number;
}

export interface AuthSession {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export const authAPI = {
  login: (credentials: LoginInput) => apiClient.post<ApiResponse<AuthSession>>("/auth/login", credentials),
  register: (data: RegisterInput) => apiClient.post<ApiResponse<AuthUser>>("/auth/register", data),
  getMe: () => apiClient.get<ApiResponse<AuthUser>>("/auth/me"),
  logout: () =>
    apiClient.post<ApiResponse<{ loggedOut: boolean }>>("/auth/logout", {}),
};
