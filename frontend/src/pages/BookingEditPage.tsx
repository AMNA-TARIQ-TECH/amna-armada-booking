import { useParams } from "react-router-dom";
import { AppShell } from "@/shared/components/AppShell";
import { BookingForm } from "@/features/bookings/components/BookingForm";

export function BookingEditPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell title="Edit booking" subtitle="Update appointment details">
      <BookingForm bookingId={id} />
    </AppShell>
  );
}
