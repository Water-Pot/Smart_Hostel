import { FormEvent, useState } from "react";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = isSignup
      ? { name, roomNo, email, password }
      : { email, password };

    // TODO: replace with your backend endpoints
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(`Failed: ${errText}`);
        return;
      }

      const data = await res.json();
      alert(`${isSignup ? "Signup" : "Login"} successful!`);

      // Store token if backend returns it
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect after success
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Server error. Please try again.");
      console.error(error);
    }
  }

  return (
    <form className="card auth-card" onSubmit={handleSubmit}>
      <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
      <p className="muted">
        {isSignup
          ? "Sign up to manage hostel services."
          : "Login to access your hostel dashboard."}
      </p>

      {isSignup && (
        <>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label>Room Number</label>
          <input
            type="text"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            placeholder="e.g. A-204"
            required
          />
        </>
      )}

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <button type="submit" className="solid-btn full-width">
        {isSignup ? "Create Account" : "Login"}
      </button>
    </form>
  );
}