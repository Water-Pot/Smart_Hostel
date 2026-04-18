"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useClientSession } from "@/lib/client-session";
import { extractToken, getErrorMessage, isTokenExpired, toPrettyResponse } from "@/lib/request-helpers";
import { Card, Input, PrimaryButton } from "@/components/ui";

type LoginForm = {
  userName: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { token, setToken, status, setStatus, setResponseText } = useClientSession();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<LoginForm>({ userName: "", password: "" });

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setBusy(true);
      const result = await apiRequest<unknown>("/user/login", {
        method: "POST",
        body: {
          userName: form.userName.trim(),
          password: form.password,
        },
      });

      const nextToken = extractToken(result);
      if (!nextToken) {
        throw new Error("Token missing in login response.");
      }
      if (isTokenExpired(nextToken)) {
        throw new Error("Received expired token.");
      }

      setToken(nextToken);
      setResponseText(toPrettyResponse(result));
      setStatus("Login successful.");
      setForm({ userName: "", password: "" });
      router.push("/profile");
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    setToken("");
    setStatus("Logged out.");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
        {status}
      </section>

      <Card title="Welcome back" subtitle="Login to continue to your profile">
        <form onSubmit={handleLogin} className="grid max-w-xl gap-3">
          <Input
            required
            placeholder="Username"
            value={form.userName}
            onChange={(value) => setForm((prev) => ({ ...prev, userName: value }))}
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
          />
          <div className="flex flex-wrap gap-3 pt-1">
            <PrimaryButton disabled={busy}>{busy ? "Signing in..." : "Login"}</PrimaryButton>
            <button
              type="button"
              onClick={handleLogout}
              disabled={busy || !token}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Logout
            </button>
            <Link
              href="/signup"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Need account? Sign Up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
