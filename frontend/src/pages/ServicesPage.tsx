import { Link } from "react-router-dom";
import { AppShell } from "@/shared/components/AppShell";
import { ServicesList } from "@/features/services/components/ServicesList";

export function ServicesPage() {
  return (
    <AppShell
      title="Services"
      subtitle="Create, edit, filter, and delete your offerings"
      actions={
        <Link to="/services/new" className="btn btn-primary">
          Add service
        </Link>
      }
    >
      <ServicesList />
    </AppShell>
  );
}
