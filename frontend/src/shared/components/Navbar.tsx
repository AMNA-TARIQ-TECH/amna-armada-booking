import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/dashboard" className="brand">
          Client Booking
        </Link>
        <nav className="nav-links">
          <Link
            className={pathname === "/dashboard" ? "active" : ""}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={pathname.startsWith("/services") ? "active" : ""}
            to="/services"
          >
            Services
          </Link>
          <Link
            className={pathname.startsWith("/bookings") ? "active" : ""}
            to="/bookings"
          >
            Bookings
          </Link>
        </nav>
        <div className="user-chip">
                    <img
            src={
              user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
            }
            alt={user.name}
            width={36}
            height={36}
          />
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
