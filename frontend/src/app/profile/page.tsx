"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useClientSession } from "@/lib/client-session";
import { getErrorMessage, toPrettyResponse } from "@/lib/request-helpers";
import { Card, Input, PrimaryButton } from "@/components/ui";

type UploadForm = {
  userId: string;
  file: File | null;
};

export default function ProfilePage() {
  const { token, status, setStatus, setResponseText } = useClientSession();
  const [busy, setBusy] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({ userId: "", file: null });

  async function handleImageUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("Please login first.");
      return;
    }

    if (!uploadForm.userId.trim()) {
      setStatus("User ID is required.");
      return;
    }

    if (!uploadForm.file) {
      setStatus("Please choose an image.");
      return;
    }

    try {
      setBusy(true);
      const formData = new FormData();
      formData.append("image", uploadForm.file);

      const result = await apiRequest<unknown>(`/user/upload-image/${encodeURIComponent(uploadForm.userId.trim())}`, {
        method: "POST",
        token,
        body: formData,
      });

      setResponseText(toPrettyResponse(result));
      setStatus("Profile image uploaded successfully.");
      setUploadForm((prev) => ({ ...prev, file: null }));
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadForm((prev) => ({ ...prev, file }));
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
        {status}
      </section>

      <Card title="User Profile" subtitle="Upload your profile image after login">
        {!token ? (
          <div className="grid gap-3">
            <p className="text-sm text-slate-200">You are not signed in yet.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Go to Login
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleImageUpload} className="grid max-w-xl gap-3">
            <Input
              required
              placeholder="Your User ID"
              value={uploadForm.userId}
              onChange={(value) => setUploadForm((prev) => ({ ...prev, userId: value }))}
            />
            <input
              required
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm"
            />
            <PrimaryButton disabled={busy}>{busy ? "Uploading..." : "Upload Image"}</PrimaryButton>
            <p className="text-xs text-slate-400">Use your backend user ID for upload.</p>
          </form>
        )}
      </Card>
    </div>
  );
}
