import { api } from "../api/client";
import type { AuthResponse, AuthUser } from "../types/auth";

export async function registerRequest(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post("/auth/register", {
    email,
    password,
  });

  return response.data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function meRequest(): Promise<AuthUser> {
  const response = await api.get("/auth/me");
  return response.data;
}