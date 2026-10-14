import { useParams } from "react-router-dom";
import { AppShell } from "@/shared/components/AppShell";
import { ServiceForm } from "@/features/services/components/ServiceForm";

export function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell title="Edit service" subtitle="Update service details">
      <ServiceForm serviceId={id} />
    </AppShell>
  );
}
