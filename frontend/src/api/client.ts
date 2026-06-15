import axios from "axios";
import { AUTH_TOKEN_STORAGE_KEY } from "../constants/auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const userEmail = import.meta.env.VITE_USER_EMAIL;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  const headers = (config.headers ?? {}) as Record<string, string>;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (userEmail) {
    headers["X-User-Email"] = userEmail;
  }

  config.headers = headers;
  return config;
});