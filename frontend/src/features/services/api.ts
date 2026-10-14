import { api } from "@/shared/lib/api";
import type { Service } from "@/shared/types";

export type ServiceFilter = "all" | "active" | "inactive";

export const fetchServices = (token: string, status: ServiceFilter = "all") =>
  api.get<Service[]>(`/services?status=${status}`, token);

export const fetchService = (token: string, id: string) =>
  api.get<Service>(`/services/${id}`, token);

export const createService = (
  token: string,
  payload: {
    title: string;
    description?: string;
    durationMinutes: number;
    isActive?: boolean;
  }
) => api.post<Service>("/services", payload, token);

export const updateService = (
  token: string,
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    durationMinutes: number;
    isActive: boolean;
  }>
) => api.put<Service>(`/services/${id}`, payload, token);

export const deleteService = (token: string, id: string) =>
  api.delete<{ id: string }>(`/services/${id}`, token);
