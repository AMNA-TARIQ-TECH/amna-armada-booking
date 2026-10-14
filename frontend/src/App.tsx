import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceNewPage } from "@/pages/ServiceNewPage";
import { ServiceEditPage } from "@/pages/ServiceEditPage";
import { BookingsPage } from "@/pages/BookingsPage";
import { BookingNewPage } from "@/pages/BookingNewPage";
import { BookingEditPage } from "@/pages/BookingEditPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/new" element={<ServiceNewPage />} />
      <Route path="/services/:id/edit" element={<ServiceEditPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/bookings/new" element={<BookingNewPage />} />
      <Route path="/bookings/:id/edit" element={<BookingEditPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
