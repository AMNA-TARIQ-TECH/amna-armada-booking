export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type Service = {
  id: string;
  userId: string;
  title: string;
  description: string;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  service?: {
    id: string;
    title: string;
    durationMinutes: number;
    isActive: boolean;
  };
};
