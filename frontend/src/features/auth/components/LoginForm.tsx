
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import type { ApiError } from "@/shared/lib/api";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9.3 3.1 11 7.5a12.3 12.3 0 01-4.2 5.1M6.1 6.1A12.4 12.4 0 001 12.5C2.7 16.9 7 20 12 20c1.6 0 3.1-.3 4.5-.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5C21.3 16.9 17 20 12 20S2.7 16.9 1 12.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LoginForm() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        navigate("/dashboard");
        return;
      }

      await register(name, email, password);
      setMode("login");
      setName("");
      setEmail("");
      setPassword("");
      setError("Account created successfully. Please log in.");
      return;
    } catch (err) {
      setError((err as ApiError).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="auth-page">
      <div className="auth-background-shape auth-shape-one" aria-hidden="true" />
      <div className="auth-background-shape auth-shape-two" aria-hidden="true" />

      
<section className="auth-card">
  <div className="auth-card-content">
    <div className="auth-brand-row">
      <div className="auth-mark" aria-hidden="true">
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="3.5"
            y="5"
            width="17"
            height="16"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h3M8 17h5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className="auth-brand-name">Flowbook</span>
    </div>



          <div className="auth-heading">
            <p className="auth-eyebrow">
              {mode === "login" ? "YOUR WORKSPACE" : "GET STARTED"}
            </p>

            <h1 className="auth-form-title">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>

            <p className="auth-form-sub">
              {mode === "login"
                ? "Enter your details to access your account."
                : "Fill in your details to create your account."}
            </p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {mode === "register" && (
              <div className="field">
                <label className="label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div className="field">
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="field">
              <div className="auth-label-row">
                <label className="label" htmlFor="password">
                  Password
                </label>
              </div>

              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary w-full auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Log In"
                  : "Create account"}

              {!loading && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>

          <div className="auth-divider">
            {/* <span>SECURE ACCOUNT ACCESS</span> */}
          </div>

          <p className="auth-switch-text">
            {mode === "login"
              ? "New here?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() =>
                changeMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? "Create an account" : "Return to login"}
            </button>
          </p>
        </div>
      </section>

      <p className="auth-footer">
        A simpler way to manage your day.
      </p>
    </main>
  );
}
