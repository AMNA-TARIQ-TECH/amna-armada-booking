import { Link } from "react-router-dom";
import { AppShell } from "@/shared/components/AppShell";
import { HomeDashboard } from "@/features/home/components/HomeDashboard";

export function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
    >
      <HomeDashboard />
    </AppShell>
  );
}
