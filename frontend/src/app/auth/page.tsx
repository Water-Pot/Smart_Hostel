import Link from "next/link";
import { Card } from "@/components/ui";

export default function AuthPage() {
  return (
    <div className="grid gap-6">
      <Card title="Authentication" subtitle="Choose what you want to do">
        <p className="mb-4 text-sm text-slate-200">Signup and login are now on separate pages.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go to Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
