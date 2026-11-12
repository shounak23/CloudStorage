import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { logout } from "../../store/slices/authSlice";
import { setTheme } from "../../store/slices/themeSlice";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.themes.theme);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // close the dropdown when clicking outside it
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error(err); // clear local state even if server call fails
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const initial = user?.username?.[0]?.toUpperCase() || "U";

  return (
    <header className="navbar">
      <button
        className="btn btn-ghost btn-icon navbar-menu"
        onClick={onMenuClick}
      >
        ☰
      </button>

      <input
        className="navbar-search"
        type="search"
        placeholder="Search files..."
      />

      <div className="navbar-actions">
        <select
          className="navbar-theme"
          value={theme}
          onChange={(e) => dispatch(setTheme(e.target.value))}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="purple">Purple</option>
        </select>

        <button className="btn btn-ghost btn-icon">🔔</button>

        <div className="dropdown" ref={menuRef}>
          <button className="avatar" onClick={() => setMenuOpen((o) => !o)}>
            {initial}
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <span>{user?.email}</span>
              </div>
              <button
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="dropdown-item dropdown-item-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
