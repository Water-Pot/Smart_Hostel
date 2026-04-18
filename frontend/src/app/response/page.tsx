"use client";

import { useClientSession } from "@/lib/client-session";
import { Card } from "@/components/ui";

export default function ResponsePage() {
  const { token, status, responseText, setStatus, setResponseText } = useClientSession();

  return (
    <div className="grid gap-6">
      <Card title="Current Session Status" subtitle="Shared across all pages">
        <p className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{status}</p>
        <p className="mt-3 break-all rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-emerald-200">
          Token: {token ? `${token.slice(0, 48)}...` : "Not logged in"}
        </p>
      </Card>

      <Card title="Latest Backend Response" subtitle="Output from Auth, Upload, and Explorer pages">
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setStatus("Response cleared.");
              setResponseText("No response yet.");
            }}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Clear Response
          </button>
        </div>

        <pre className="max-h-[34rem] overflow-auto rounded-xl border border-white/10 bg-slate-900/90 p-4 text-xs text-emerald-200">
          {responseText}
        </pre>
      </Card>
    </div>
  );
}
