"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useClientSession } from "@/lib/client-session";
import { getErrorMessage, toPrettyResponse } from "@/lib/request-helpers";
import { Card, Input, PrimaryButton } from "@/components/ui";

type UploadForm = {
  userId: string;
  file: File | null;
};

export default function UploadPage() {
  const { token, status, setStatus, setResponseText } = useClientSession();
  const [busy, setBusy] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({ userId: "1", file: null });

  async function handleImageUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("Login required for image upload.");
      return;
    }

    if (!uploadForm.userId.trim()) {
      setStatus("User ID is required.");
      return;
    }

    if (!uploadForm.file) {
      setStatus("Please select an image file.");
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
      setStatus("Image uploaded successfully.");
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

      <Card title="Upload User Image" subtitle="POST /user/upload-image/{userId}">
        <form onSubmit={handleImageUpload} className="grid max-w-xl gap-3">
          <Input
            required
            placeholder="User ID"
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
          <PrimaryButton disabled={busy || !token}>Upload</PrimaryButton>
        </form>
      </Card>
    </div>
  );
}
