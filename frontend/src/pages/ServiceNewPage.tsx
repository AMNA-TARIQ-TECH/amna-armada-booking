import { AppShell } from "@/shared/components/AppShell";
import { ServiceForm } from "@/features/services/components/ServiceForm";

export function ServiceNewPage() {
  return (
    <AppShell title="New service" subtitle="Add a new offering">
      <ServiceForm />
    </AppShell>
  );
}
