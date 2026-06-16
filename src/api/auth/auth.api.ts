import { httpClient } from "../httpClient.api";
import type {
  ApiLoginResponse,
  ApiRegisterResponse,
  ApiUser,
  LoginRequest,
  RegisterRequest,
  User,
} from "./auth.type";

export type {
  ApiLoginResponse,
  ApiRegisterResponse,
  ApiUser,
  LoginRequest,
  RegisterRequest,
  User,
} from "./auth.type";

export const mapApiUser = (raw: ApiUser): User => ({
  id: raw.id,
  email: raw.email,
  name: raw.name,
  avatar: raw.avatar,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await httpClient.post<ApiRegisterResponse, RegisterRequest>({
    url: "/v1/auth/register",
    data,
  });

  if (!response) throw new Error("No response from server");
  return mapApiUser(response.user);
};

export const login = async (
  data: LoginRequest
): Promise<{ user: User; accessToken: string }> => {
  const response = await httpClient.post<ApiLoginResponse, LoginRequest>({
    url: "/v1/auth/login",
    data,
  });

  if (!response) throw new Error("No response from server");
  return {
    user: mapApiUser(response.user),
    accessToken: response.accessToken,
  };
};

export const getMe = async (): Promise<User> => {
  const response = await httpClient.get<ApiUser>({
    url: "/v1/auth/me",
  });

  if (!response) throw new Error("No response from server");
  return mapApiUser(response);
};
