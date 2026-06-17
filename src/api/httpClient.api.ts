import { axiosClient } from "./axios.config";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  HttpRequestConfig,
} from "./http.type";

const cleanParams = (params?: Record<string, unknown>) => {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== "" && value !== undefined && value !== null;
    }),
  );
};

export const httpClient = {
  async get<T>(config: HttpRequestConfig<never>): Promise<T | null> {
    const res = await axiosClient.get<ApiSuccessResponse<T>>(config.url, {
      params: cleanParams(config.params),
      headers: config.headers,
    });

    return res.data.data;
  },

  async getList<T>(config: HttpRequestConfig<never>): Promise<T[]> {
    const res = await axiosClient.get<ApiSuccessResponse<T[]>>(config.url, {
      params: cleanParams(config.params),
      headers: config.headers,
    });

    return res.data.data ?? [];
  },

  async getPaginated<T>(
    config: HttpRequestConfig<never>,
  ): Promise<ApiPaginatedResponse<T>> {
    const res = await axiosClient.get<ApiPaginatedResponse<T>>(config.url, {
      params: cleanParams(config.params),
      headers: config.headers,
    });

    return res.data;
  },

  async post<T, D>(config: HttpRequestConfig<D>): Promise<T | null> {
    const res = await axiosClient.post<ApiSuccessResponse<T>>(
      config.url,
      config.data,
      { headers: config.headers },
    );

    return res.data.data;
  },

  async postRaw<T, D>(config: HttpRequestConfig<D>): Promise<T | null> {
    const res = await axiosClient.post<ApiSuccessResponse<T>>(
      config.url,
      JSON.stringify(config.data),
      {
        headers: { "Content-Type": "application/json", ...config.headers },
      },
    );

    return res.data.data;
  },

  async put<T, D>(config: HttpRequestConfig<D>): Promise<T | null> {
    const res = await axiosClient.put<ApiSuccessResponse<T>>(
      config.url,
      config.data,
      { headers: config.headers },
    );

    return res.data.data;
  },

  async patch<T, D>(config: HttpRequestConfig<D>): Promise<T | null> {
    const res = await axiosClient.patch<ApiSuccessResponse<T>>(
      config.url,
      config.data,
      { headers: config.headers },
    );

    return res.data.data;
  },

  async delete<T>(config: HttpRequestConfig<never>): Promise<T | null> {
    const res = await axiosClient.delete<ApiSuccessResponse<T>>(config.url, {
      params: cleanParams(config.params),
      headers: config.headers,
    });

    return res.data.data;
  },
};
