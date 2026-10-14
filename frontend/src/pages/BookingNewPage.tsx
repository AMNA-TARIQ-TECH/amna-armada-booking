import { AppShell } from "@/shared/components/AppShell";
import { BookingForm } from "@/features/bookings/components/BookingForm";

export function BookingNewPage() {
  return (
    <AppShell title="New booking" subtitle="Schedule a client appointment">
      <BookingForm />
    </AppShell>
  );
}
