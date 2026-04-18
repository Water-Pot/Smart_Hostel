import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <button className="brand" onClick={() => navigate("/")}>
          Smart Hostel
        </button>

        <div className="nav-links">
          <NavLink to="/" className="nav-btn">
            Home
          </NavLink>
          <NavLink to="/dashboard" className="nav-btn">
            Dashboard
          </NavLink>
          <NavLink to="/profile" className="nav-btn">
            Profile
          </NavLink>
          <NavLink to="/complaints" className="nav-btn">
            Complaints
          </NavLink>
        </div>

        <div className="nav-actions">
          <NavLink to="/login" className="outline-btn">
            Login
          </NavLink>
          <NavLink to="/signup" className="solid-btn">
            Signup
          </NavLink>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Night" : "☀️ Day"}
          </button>
        </div>
      </nav>
    </header>
  );
}