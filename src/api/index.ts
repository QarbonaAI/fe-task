import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { handleAPIError } from "@/lib/errors";
import { env } from "@/env.js";

// Extend AxiosRequestConfig to include the _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  baseURL: env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com",
  timeout: 10000,
});

// Add a request interceptor
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // No auth needed for DummyJSON API
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error: AxiosError) => Promise.reject(handleAPIError(error)),
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const error = err as AxiosError;
    return Promise.reject(handleAPIError(error));
  },
);

export default api;
