import { Link } from "react-router-dom";
import { AppShell } from "@/shared/components/AppShell";
import { BookingsList } from "@/features/bookings/components/BookingsList";

export function BookingsPage() {
  return (
    <AppShell
      title="Bookings"
      subtitle="Filter, update status, edit, or delete appointments"
      actions={
        <Link to="/bookings/new" className="btn btn-primary">
          New booking
        </Link>
      }
    >
      <BookingsList />
    </AppShell>
  );
}
