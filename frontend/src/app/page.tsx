import Link from "next/link";
import { ENDPOINTS } from "@/lib/endpoints";
import { Card } from "@/components/ui";

export default function HomePage() {
  const publicCount = ENDPOINTS.filter((endpoint) => endpoint.isPublic).length;
  const secureCount = ENDPOINTS.length - publicCount;
  const categories = Array.from(new Set(ENDPOINTS.map((endpoint) => endpoint.category)));

  const stats = [
    { title: "Total Endpoints", value: ENDPOINTS.length },
    { title: "Public Endpoints", value: publicCount },
    { title: "Secured Endpoints", value: secureCount },
    { title: "Categories", value: categories.length },
  ];

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-600/30 via-sky-500/30 to-emerald-500/30 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-100">Smart Hostel</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Beautiful Multi-Page API Frontend</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
          Now each feature is split into dedicated pages. Use the left menu to move page by page and
          run every backend function with cleaner workflow.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <QuickLink href="/auth" label="Start with Auth" />
          <QuickLink href="/explorer" label="Open API Explorer" />
          <QuickLink href="/upload" label="Go to Image Upload" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} title={stat.title}>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Page Flow" subtitle="Use this sequence for best result">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-200">
            <li>Create account / login in <strong>Auth</strong> page.</li>
            <li>Upload image in <strong>Image Upload</strong> page.</li>
            <li>Run all API methods in <strong>API Explorer</strong> page.</li>
            <li>Review latest backend output in <strong>Response</strong> page.</li>
          </ol>
        </Card>

        <Card title="Backend Coverage" subtitle="All methods are connected">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                {category}
              </span>
            ))}
          </div>
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
