"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useClientSession } from "@/lib/client-session";
import { getErrorMessage, toPrettyResponse } from "@/lib/request-helpers";
import { Card, Input, PrimaryButton } from "@/components/ui";

type SignupForm = {
  userName: string;
  password: string;
  roleCsv: string;
};

export default function SignupPage() {
  const { status, setStatus, setResponseText } = useClientSession();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    userName: "",
    password: "",
    roleCsv: "tenant",
  });

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const roleNames = form.roleCsv
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    if (!form.userName.trim() || !form.password.trim()) {
      setStatus("Username and password are required.");
      return;
    }

    if (roleNames.length === 0) {
      setStatus("Enter at least one role.");
      return;
    }

    try {
      setBusy(true);
      const result = await apiRequest<unknown>("/user/signup", {
        method: "POST",
        body: {
          userName: form.userName.trim(),
          password: form.password,
          role: roleNames,
        },
      });
      setResponseText(toPrettyResponse(result));
      setStatus("Signup successful. Please login.");
      setForm({ userName: "", password: "", roleCsv: "tenant" });
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
        {status}
      </section>

      <Card title="Create your account" subtitle="Quick signup for Smart Hostel">
        <form onSubmit={handleSignup} className="grid max-w-xl gap-3">
          <Input
            required
            minLength={3}
            maxLength={7}
            placeholder="Username"
            value={form.userName}
            onChange={(value) => setForm((prev) => ({ ...prev, userName: value }))}
          />
          <Input
            required
            type="password"
            minLength={4}
            maxLength={14}
            placeholder="Password"
            value={form.password}
            onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
          />
          <Input
            required
            placeholder="Role (example: tenant)"
            value={form.roleCsv}
            onChange={(value) => setForm((prev) => ({ ...prev, roleCsv: value }))}
          />
          <div className="flex flex-wrap gap-3 pt-1">
            <PrimaryButton disabled={busy}>{busy ? "Creating..." : "Sign Up"}</PrimaryButton>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
