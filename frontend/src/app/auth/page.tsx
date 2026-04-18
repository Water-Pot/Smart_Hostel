"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useClientSession } from "@/lib/client-session";
import { extractToken, getErrorMessage, isTokenExpired, toPrettyResponse } from "@/lib/request-helpers";
import { Card, Input, PrimaryButton } from "@/components/ui";

type AuthForm = {
  userName: string;
  password: string;
};

type SignupForm = AuthForm & {
  roleCsv: string;
};

export default function AuthPage() {
  const { token, setToken, status, setStatus, setResponseText } = useClientSession();

  const [busy, setBusy] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    userName: "",
    password: "",
    roleCsv: "tenant",
  });
  const [loginForm, setLoginForm] = useState<AuthForm>({ userName: "", password: "" });

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const roleNames = signupForm.roleCsv
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    if (roleNames.length === 0) {
      setStatus("Enter at least one role.");
      return;
    }

    try {
      setBusy(true);
      const result = await apiRequest<unknown>("/user/signup", {
        method: "POST",
        body: {
          userName: signupForm.userName,
          password: signupForm.password,
          role: roleNames,
        },
      });
      setResponseText(toPrettyResponse(result));
      setStatus("Signup successful.");
      setSignupForm({ userName: "", password: "", roleCsv: "tenant" });
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setBusy(true);
      const result = await apiRequest<unknown>("/user/login", {
        method: "POST",
        body: loginForm,
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
      setStatus("Login successful. Token saved.");
      setLoginForm({ userName: "", password: "" });
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

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Create Account" subtitle="POST /user/signup">
          <form onSubmit={handleSignup} className="grid gap-3">
            <Input
              required
              placeholder="Username"
              value={signupForm.userName}
              onChange={(value) => setSignupForm((prev) => ({ ...prev, userName: value }))}
            />
            <Input
              required
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(value) => setSignupForm((prev) => ({ ...prev, password: value }))}
            />
            <Input
              required
              placeholder="Roles (comma separated)"
              value={signupForm.roleCsv}
              onChange={(value) => setSignupForm((prev) => ({ ...prev, roleCsv: value }))}
            />
            <PrimaryButton disabled={busy}>Sign Up</PrimaryButton>
          </form>
        </Card>

        <Card title="Login" subtitle="POST /user/login">
          <form onSubmit={handleLogin} className="grid gap-3">
            <Input
              required
              placeholder="Username"
              value={loginForm.userName}
              onChange={(value) => setLoginForm((prev) => ({ ...prev, userName: value }))}
            />
            <Input
              required
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
            />
            <div className="flex flex-wrap gap-2">
              <PrimaryButton disabled={busy}>Login</PrimaryButton>
              <button
                type="button"
                onClick={handleLogout}
                disabled={busy || !token}
                className="rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Logout
              </button>
            </div>
          </form>

          <p className="mt-4 break-all rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-emerald-200">
            Token: {token ? `${token.slice(0, 48)}...` : "Not logged in"}
          </p>
        </Card>
      </section>
    </div>
  );
}
