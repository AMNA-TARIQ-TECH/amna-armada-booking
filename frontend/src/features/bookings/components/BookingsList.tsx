import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import type { Booking, BookingStatus } from "@/shared/types";
import type { ApiError } from "@/shared/lib/api";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import * as bookingsApi from "../api";
import type { BookingFilter } from "../api";

const FILTERS: { label: string; value: BookingFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

export function BookingsList() {
  const { token } = useAuth();
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    await Promise.resolve();
    setLoading(true);
    setError("");
    try {
      const data = await bookingsApi.fetchBookings(token, filter);
      setBookings(data);
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
        const data = await bookingsApi.fetchBookings(token, filter);
        if (!cancelled) setBookings(data);
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

  async function onStatusChange(id: string, next: BookingStatus) {
    if (!token) return;
    try {
      await bookingsApi.updateBookingStatus(token, id, next);
      await load();
    } catch (err) {
      setError((err as ApiError).message);
    }
  }

  async function confirmDelete() {
    if (!token || !deleteId) return;
    setDeleting(true);
    try {
      await bookingsApi.deleteBooking(token, deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setDeleting(false);
    }
  }

  const pendingBooking = bookings.find((b) => b.id === deleteId);

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
      {loading && <div className="loading">Loading bookings...</div>}

      {!loading && bookings.length === 0 && (
        <div className="empty card">
          No bookings for this filter.{" "}
          <Link to="/bookings/new" className="home-action-link">
            Add one →
          </Link>
        </div>
      )}

      <div className="list">
        {bookings.map((booking) => (
          <article key={booking.id} className="card list-item">
            <div>
              <div className="row-between">
                <h3>{booking.clientName}</h3>
                <span className={`badge badge-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <p className="muted">{booking.clientEmail}</p>
              <p className="meta">
                {booking.service?.title || "Service"} ·{" "}
                {new Date(booking.date).toLocaleString()}
              </p>
            </div>
            <div className="actions">
              <select
                className="input status-select"
                value={booking.status}
                onChange={(e) =>
                  onStatusChange(booking.id, e.target.value as BookingStatus)
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Link
                to={`/bookings/${booking.id}/edit`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setDeleteId(booking.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete booking"
        message={
          pendingBooking
            ? `Delete booking for "${pendingBooking.clientName}"? This cannot be undone.`
            : "Delete this booking? This cannot be undone."
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
