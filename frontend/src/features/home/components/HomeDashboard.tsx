import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchServices } from "@/features/services/api";
import { fetchBookings } from "@/features/bookings/api";
import type { Booking, Service } from "@/shared/types";
import type { ApiError } from "@/shared/lib/api";

const STATUS_COLORS = {
  pending: "#d97706",
  confirmed: "#0f766e",
  cancelled: "#b42318",
};

export function HomeDashboard() {
  const { user, token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      await Promise.resolve();
      if (cancelled) return;
      try {
        const [serviceData, bookingData] = await Promise.all([
          fetchServices(token!, "all"),
          fetchBookings(token!, "all"),
        ]);
        if (cancelled) return;
        setServices(serviceData);
        setBookings(bookingData);
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
  }, [token]);

  const activeServices = services.filter((s) => s.isActive).length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const statusChart = useMemo(
    () => [
      { name: "Pending", value: pending, key: "pending" },
      { name: "Confirmed", value: confirmed, key: "confirmed" },
      { name: "Cancelled", value: cancelled, key: "cancelled" },
    ],
    [pending, confirmed, cancelled]
  );

  const serviceChart = useMemo(
    () => [
      { name: "Active", value: activeServices },
      { name: "Inactive", value: Math.max(services.length - activeServices, 0) },
    ],
    [activeServices, services.length]
  );

  const timelineChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    return days.map((day) => {
      const next = new Date(day);
      next.setDate(day.getDate() + 1);
      const count = bookings.filter((b) => {
        const date = new Date(b.date);
        return date >= day && date < next;
      }).length;
      return {
        day: day.toLocaleDateString(undefined, { weekday: "short" }),
        bookings: count,
      };
    });
  }, [bookings]);

  const upcoming = useMemo(
    () =>
      [...bookings]
        .filter((b) => b.status !== "cancelled")
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))
        .slice(0, 5),
    [bookings]
  );

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dash stack">
      <section className="dash-welcome">
        <div>
          <p className="home-kicker">Overview</p>
          <h2>Hello, {user?.name?.split(" ")[0] || "there"}</h2>
          <p className="muted">
            Your booking health across services and appointments.
          </p>
        </div>
        <div className="dash-welcome-actions">
        </div>
      </section>

      {error && <div className="error-box">{error}</div>}

      <section className="home-stats">
        <article className="home-stat">
          <span className="home-stat-label">Services</span>
          <strong className="home-stat-value">{services.length}</strong>
          <span className="muted">{activeServices} active</span>
        </article>
        <article className="home-stat">
          <span className="home-stat-label">Bookings</span>
          <strong className="home-stat-value">{bookings.length}</strong>
          <span className="muted">{pending} pending</span>
        </article>
        <article className="home-stat">
          <span className="home-stat-label">Confirmed</span>
          <strong className="home-stat-value">{confirmed}</strong>
          <span className="muted">{cancelled} cancelled</span>
        </article>
      </section>

      <section className="dash-charts">
        <article className="dash-chart-card">
          <div className="dash-chart-head">
            <h3>Bookings this week</h3>
            <span className="muted">Last 7 days</span>
          </div>
          <div className="dash-chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={timelineChart}>
                <defs>
                  <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e4e7ec" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1d4ed8"
                  fill="url(#bookingsFill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="dash-chart-card">
          <div className="dash-chart-head">
            <h3>Status mix</h3>
            <span className="muted">All bookings</span>
          </div>
          <div className="dash-chart-body dash-chart-pie">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusChart}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {statusChart.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <ul className="dash-legend">
              {statusChart.map((item) => (
                <li key={item.key}>
                  <span
                    style={{
                      background:
                        STATUS_COLORS[item.key as keyof typeof STATUS_COLORS],
                    }}
                  />
                  {item.name}: {item.value}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="dash-chart-card">
          <div className="dash-chart-head">
            <h3>Services</h3>
            <span className="muted">Active vs inactive</span>
          </div>
          <div className="dash-chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={serviceChart}>
                <CartesianGrid stroke="#e4e7ec" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="dash-upcoming card">
        <div className="dash-chart-head">
          <h3>Upcoming bookings</h3>
          <Link to="/bookings" className="home-action-link">
            View all →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="empty">No upcoming bookings yet.</div>
        ) : (
          <div className="list">
            {upcoming.map((booking) => (
              <article key={booking.id} className="dash-upcoming-row">
                <div>
                  <strong>{booking.clientName}</strong>
                  <p className="muted">
                    {booking.service?.title || "Service"} ·{" "}
                    {new Date(booking.date).toLocaleString()}
                  </p>
                </div>
                <span className={`badge badge-${booking.status}`}>
                  {booking.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
