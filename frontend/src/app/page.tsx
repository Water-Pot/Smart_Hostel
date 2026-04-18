import Link from "next/link";
import { Card } from "@/components/ui";
import { ENDPOINTS } from "@/lib/endpoints";

export default function HomePage() {
  const categoryMap = new Map<string, number>();
  for (const endpoint of ENDPOINTS) {
    categoryMap.set(endpoint.category, (categoryMap.get(endpoint.category) ?? 0) + 1);
  }
  const categorySummary = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const publicCount = ENDPOINTS.filter((endpoint) => endpoint.isPublic).length;
  const securedCount = ENDPOINTS.length - publicCount;

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600/30 via-sky-500/30 to-emerald-500/30 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-100">Smart Hostel</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Clean Frontend for Your Backend Features</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
          User-friendly experience with clear navigation, quick access to account pages, and a feature catalog mapped directly
          from your backend endpoints.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <QuickLink href="/signup" label="Sign Up" />
          <QuickLink href="/login" label="Login" />
          <QuickLink href="/profile" label="Profile" />
          <QuickLink href="/explorer" label="View Backend Features" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Authentication Flow" subtitle="Simple user journey">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-200">
            <li>Create account in Sign Up page.</li>
            <li>Login with your username and password.</li>
            <li>Open Profile page and upload your image.</li>
          </ol>
        </Card>

        <Card title="Backend Coverage" subtitle="From your current API">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
            <li>Total API actions: {ENDPOINTS.length}</li>
            <li>Public actions: {publicCount}</li>
            <li>Secured actions: {securedCount}</li>
          </ul>
        </Card>

        <Card title="Navigation Focus" subtitle="Good looking and user friendly">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
            <li>Top navigation bar with clear labels</li>
            <li>Feature grouping page for backend modules</li>
            <li>Dedicated session page to track backend responses</li>
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {categorySummary.map((category) => (
          <Card key={category.name} title={category.name} subtitle={`${category.count} backend actions`}>
            <p className="text-sm text-slate-200">
              This module is available in your backend and can be used from this frontend flow.
            </p>
          </Card>
        ))}
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
