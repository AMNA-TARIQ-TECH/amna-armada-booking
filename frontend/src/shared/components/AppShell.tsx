import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { AuthGuard } from "@/shared/components/AuthGuard";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "overview" },
  { href: "/services", label: "Services", icon: "services" },
  { href: "/bookings", label: "Bookings", icon: "bookings" },
] as const;

function NavIcon({ name }: { name: string }) {
  if (name === "overview") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 4h7v7H4V4zm9 0h7v5h-7V4zM4 13h7v7H4v-7zm9 3h7v4h-7v-4z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }
  if (name === "services") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7h16M4 12h16M4 17h10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 3v4M16 3v4M4 10h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <AuthGuard>
      <div className={`app-layout ${open ? "sidebar-open" : ""}`}>
        <aside className="app-sidebar">
          <div className="sidebar-top">
            <Link
              to="/dashboard"
              className="sidebar-brand"
              onClick={() => setOpen(false)}
            >
              Flowbook
            </Link>
            <button
              type="button"
              className="sidebar-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <p className="sidebar-label">Menu</p>
          <nav className="sidebar-nav">
            {NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`sidebar-link ${active ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
                            <img
                src={
                  user?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=1d4ed8&color=fff`
                }
                alt={user?.name || "User"}
                width={32}
                height={32}
              />
              <div className="sidebar-user-meta">
                <div className="user-name">{user?.name}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="app-main">
          <header className="app-topbar">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div>
              <h1 className="app-page-title">{title}</h1>
              {subtitle && <p className="app-page-sub muted">{subtitle}</p>}
            </div>
            <div className="app-topbar-actions">{actions}</div>
          </header>
          <div className="app-content">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
