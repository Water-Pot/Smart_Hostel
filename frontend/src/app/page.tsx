import Link from "next/link";
import { Card } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600/30 via-sky-500/30 to-emerald-500/30 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-100">Smart Hostel</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Simple & Modern Student Portal</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
          Clean frontend connected to your backend with a clear flow: create account, login, then upload profile image.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <QuickLink href="/signup" label="Sign Up" />
          <QuickLink href="/login" label="Login" />
          <QuickLink href="/profile" label="Profile" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="How to Use" subtitle="Fast onboarding flow">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-200">
            <li>Create account in Sign Up page.</li>
            <li>Login with your username and password.</li>
            <li>Open Profile page and upload your image.</li>
          </ol>
        </Card>

        <Card title="Design Focus" subtitle="User-friendly UI">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
            <li>Separate authentication pages</li>
            <li>Clean navigation without backend method noise</li>
            <li>Profile upload shown after sign-in</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
    >
      {label}
    </Link>
  );
}
