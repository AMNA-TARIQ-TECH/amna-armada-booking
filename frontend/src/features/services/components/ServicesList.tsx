import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import type { Service } from "@/shared/types";
import type { ApiError } from "@/shared/lib/api";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import * as servicesApi from "../api";
import type { ServiceFilter } from "../api";

const FILTERS: { label: string; value: ServiceFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export function ServicesList() {
  const { token } = useAuth();
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggleService, setToggleService] = useState<Service | null>(null);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    await Promise.resolve();
    setLoading(true);
    setError("");
    try {
      const data = await servicesApi.fetchServices(token, filter);
      setServices(data);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) return;
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError("");
      try {
        const data = await servicesApi.fetchServices(token, filter);
        if (!cancelled) setServices(data);
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [token, filter]);

  async function confirmToggle() {
    if (!token || !toggleService) return;
    setToggling(true);
    try {
      await servicesApi.updateService(token, toggleService.id, {
        isActive: !toggleService.isActive,
      });
      setToggleService(null);
      await load();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setToggling(false);
    }
  }

  async function confirmDelete() {
    if (!token || !deleteId) return;
    setDeleting(true);
    try {
      await servicesApi.deleteService(token, deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setDeleting(false);
    }
  }

  const pendingDelete = services.find((s) => s.id === deleteId);
  const willActivate = toggleService ? !toggleService.isActive : false;

  return (
    <div className="stack">
      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`filter-chip ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="loading">Loading services...</div>}

      {!loading && services.length === 0 && (
        <div className="empty card">
          No services found. Create your first service.
        </div>
      )}

      <div className="list">
        {services.map((service) => (
          <article key={service.id} className="card list-item">
            <div>
              <div className="row-between">
                <h3>{service.title}</h3>
                <span
                  className={`badge ${service.isActive ? "badge-active" : "badge-inactive"}`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="muted">{service.description || "No description"}</p>
              <p className="meta">{service.durationMinutes} minutes</p>
            </div>
            <div className="actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setToggleService(service)}
              >
                {service.isActive ? "Deactivate" : "Activate"}
              </button>
              <Link
                to={`/services/${service.id}/edit`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setDeleteId(service.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(toggleService)}
        title={willActivate ? "Activate service" : "Deactivate service"}
        message={
          toggleService
            ? willActivate
              ? `Activate "${toggleService.title}"? It will show up for new bookings.`
              : `Deactivate "${toggleService.title}"? It will be hidden from new bookings.`
            : "Update this service status?"
        }
        confirmLabel={willActivate ? "Activate" : "Deactivate"}
        loading={toggling}
        onConfirm={confirmToggle}
        onCancel={() => !toggling && setToggleService(null)}
      />

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete service"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.title}"? This cannot be undone.`
            : "Delete this service? This cannot be undone."
        }
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteId(null)}
      />
    </div>
  );
}
