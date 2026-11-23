import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { setCredentials } from "../store/slices/authSlice";

const getErrorMessage = (err) => {
  if (err.code === "ECONNABORTED")
    return "The server took too long to respond. Please try again.";
  if (!err.response)
    return "Cannot reach the server. Check your internet connection.";
  const { status, data } = err.response;
  if (status === 401) return "Invalid email or password.";
  if (status === 429) return "Too many attempts. Please try again later.";
  return data?.message || "Something went wrong. Please try again.";
};

const LogInPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");

  // show a reassurance message if the request takes more than 5 seconds
  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // guard against double submit

    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/auth/login", form, {
        timeout: 15000,
      });
      const { accessToken, id, username, email } = res.data.data;
      // PublicRoute sees isAuthenticated and redirects to /dashboard
      dispatch(
        setCredentials({
          user: { id, username, email },
          accessToken,
        }),
      );
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">☁️ Cloud Storage</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to access your files</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              required
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className="field-password">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="field-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading || !form.email || !form.password}
          >
            {loading && <span className="spinner" />}
            {loading ? "Logging in..." : "Log in"}
          </button>

          {slow && (
            <p className="auth-slow">
              Taking longer than usual. Your connection may be slow, please
              wait...
            </p>
          )}
        </form>

        <div className="auth-footer">
          New to Cloud Storage?{" "}
          <Link to="/register" className="auth-link">
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
