import { api } from "@/shared/lib/api";
import type { Booking, BookingStatus } from "@/shared/types";

export type BookingFilter = "all" | BookingStatus;

export type BookingPayload = {
  serviceId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  status?: BookingStatus;
};

export const fetchBookings = (token: string, status: BookingFilter = "all") =>
  api.get<Booking[]>(`/bookings?status=${status}`, token);

export const fetchBooking = (token: string, id: string) =>
  api.get<Booking>(`/bookings/${id}`, token);

export const createBooking = (token: string, payload: BookingPayload) =>
  api.post<Booking>("/bookings", payload, token);

export const updateBooking = (
  token: string,
  id: string,
  payload: Partial<BookingPayload>
) => api.put<Booking>(`/bookings/${id}`, payload, token);

export const updateBookingStatus = (
  token: string,
  id: string,
  status: BookingStatus
) => api.patch<Booking>(`/bookings/${id}/status`, { status }, token);

export const deleteBooking = (token: string, id: string) =>
  api.delete<{ id: string }>(`/bookings/${id}`, token);
