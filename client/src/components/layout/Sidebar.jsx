import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/files", icon: "📁", label: "My Files" },
  { to: "/upload", icon: "⬆️", label: "Upload" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const Sidebar = ({ open, onClose }) => {
  const usedGB = 2.3;
  const totalGB = 5;
  const percent = (usedGB / totalGB) * 100;

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">☁️ CloudStorage</div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-storage">
          <div className="progress-label">
            <span>Storage</span>
            <span>
              {usedGB}GB / {totalGB}GB
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
