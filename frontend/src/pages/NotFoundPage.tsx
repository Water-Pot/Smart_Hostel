import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="card center">
      <h2>404 - Page Not Found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
      <button className="solid-btn" onClick={() => navigate("/")}>
        Go Home
      </button>
    </section>
  );
}