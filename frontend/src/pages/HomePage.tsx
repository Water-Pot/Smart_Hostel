import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="hero card">
      <h1>Smart Hostel Management</h1>
      <p className="muted">
        Manage rooms, complaints, profile, and hostel services in one place.
      </p>
      <div className="hero-actions">
        <button className="solid-btn" onClick={() => navigate("/signup")}>
          Get Started
        </button>
        <button className="outline-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </section>
  );
}