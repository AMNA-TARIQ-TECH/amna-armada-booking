import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import type { ApiError } from "@/shared/lib/api";
import * as servicesApi from "../api";

type Props = { serviceId?: string };

export function ServiceForm({ serviceId }: Props) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !serviceId) return;
    let cancelled = false;

    async function load() {
      await Promise.resolve();
      if (cancelled) return;
      try {
        const s = await servicesApi.fetchService(token!, serviceId!);
        if (cancelled) return;
        setTitle(s.title);
        setDescription(s.description || "");
        setDurationMinutes(s.durationMinutes);
        setIsActive(s.isActive);
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
  }, [token, serviceId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const payload = { title, description, durationMinutes, isActive };
      if (serviceId) await servicesApi.updateService(token, serviceId, payload);
      else await servicesApi.createService(token, payload);
      navigate("/services");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading">Loading service...</div>;

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <h1>{serviceId ? "Edit service" : "Add service"}</h1>

      <div className="field">
        <label className="label">Title *</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
            <div className="field">
        <label className="label">Duration (minutes)</label>
        <input
          className="input"
          type="number"
          min={1}
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          required
        />
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>




      <div className="field">
  <label className="label">Status</label>
  <label className="toggle-card" htmlFor="isActive">
    <span className="toggle-text">
      <span className="toggle-title">{isActive ? "Active" : "Inactive"}</span>
      <span className="toggle-desc">
        {isActive ? "Visible and available for booking" : "Hidden from customers"}
      </span>
    </span>
    <input
      id="isActive"
      className="toggle-input"
      type="checkbox"
      checked={isActive}
      onChange={(e) => setIsActive(e.target.checked)}
    />
    <span className="toggle-switch" aria-hidden="true" />
  </label>
</div>

      {error && <div className="error-box">{error}</div>}

      <div className="actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/services")}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
