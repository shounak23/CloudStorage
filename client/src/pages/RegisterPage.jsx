import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const getErrorMessage = (err) => {
  if (err.code === "ECONNABORTED")
    return "The server took too long to respond. Please try again.";
  if (!err.response)
    return "Cannot reach the server. Check your internet connection.";
  const { status, data } = err.response;
  if (status === 409)
    return "This email is already registered. Try logging in.";
  if (status === 429) return "Too many attempts. Please try again later.";
  return data?.message || "Something went wrong. Please try again.";
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // slow network reassurance
  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  // after success, send the user to login
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // same rules as the backend zod schema
  const validate = () => {
    if (form.username.trim().length < 3)
      return "Username must be at least 3 characters.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(
        "/auth/register",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        },
        { timeout: 15000 },
      );
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch =
    form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">☁️ Cloud Storage</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Store and access your files anywhere</p>
        </div>

        {success ? (
          <div className="alert alert-success" role="status">
            Account created successfully! Redirecting you to log in...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="field-input"
                placeholder="Your name"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                required
                disabled={loading}
              />
            </div>

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
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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
              <span className="field-hint">Use at least 6 characters.</span>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword" className="field-label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="field-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              {passwordMismatch && (
                <span className="field-error">Passwords do not match.</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={
                loading ||
                !form.username ||
                !form.email ||
                !form.password ||
                !form.confirmPassword
              }
            >
              {loading && <span className="spinner" />}
              {loading ? "Creating account..." : "Create account"}
            </button>

            {slow && (
              <p className="auth-slow">
                Taking longer than usual. Your connection may be slow, please
                wait...
              </p>
            )}
          </form>
        )}

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
