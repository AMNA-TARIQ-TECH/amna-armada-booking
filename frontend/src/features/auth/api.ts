import { api } from "@/shared/lib/api";
import type { User } from "@/shared/types";

export type AuthResponse = { user: User; token: string };

export const login = (email: string, password: string) =>
  api.post<AuthResponse>("/auth/login", { email, password });

export const register = (payload: {
  name: string;
  email: string;
  password: string;
}) => api.post<AuthResponse>("/auth/register", payload);

export const getMe = (token: string) => api.get<User>("/auth/me", token);
