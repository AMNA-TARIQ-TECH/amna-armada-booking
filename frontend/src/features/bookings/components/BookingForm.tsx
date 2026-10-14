import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import type { BookingStatus } from "@/shared/types";
import type { ApiError } from "@/shared/lib/api";
import { fetchServices } from "@/features/services/api";
import * as bookingsApi from "../api";

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = { bookingId?: string };

export function BookingForm({ bookingId }: Props) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<{ id: string; title: string }[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError("");
      try {
        const serviceData = await fetchServices(token!, "active");
        if (cancelled) return;
        setServices(serviceData.map((s) => ({ id: s.id, title: s.title })));

        if (bookingId) {
          const booking = await bookingsApi.fetchBooking(token!, bookingId);
          if (cancelled) return;
          setServiceId(booking.serviceId);
          setClientName(booking.clientName);
          setClientEmail(booking.clientEmail);
          setDate(toLocalInputValue(booking.date));
          setStatus(booking.status);
        } else {
          setServiceId(serviceData[0]?.id || "");
        }
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token, bookingId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        serviceId,
        clientName,
        clientEmail,
        date: new Date(date).toISOString(),
        status,
      };
      if (bookingId) await bookingsApi.updateBooking(token, bookingId, payload);
      else await bookingsApi.createBooking(token, payload);
      navigate("/bookings");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading">Loading form...</div>;

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="field">
        <label className="label">Service</label>
        <select
          className="input"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
        >
          {services.length === 0 && <option value="">No active services</option>}
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">Client name</label>
        <input
          className="input"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="label">Client email</label>
        <input
          className="input"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="label">Date & time</label>
        <input
          className="input"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="label">Status</label>
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus)}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/bookings")}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={saving || services.length === 0}
        >
          {saving ? "Saving..." : bookingId ? "Update booking" : "Create booking"}
        </button>
      </div>
    </form>
  );
}
