import { Card } from "@/components/ui";
import { ENDPOINTS } from "@/lib/endpoints";

const MAX_DISPLAYED_ENDPOINTS = 8;

export default function ExplorerPage() {
  const groups = ENDPOINTS.reduce<Record<string, typeof ENDPOINTS>>((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {});

  const categories = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="grid gap-6">
      <Card title="Backend Feature Catalog" subtitle="Features included from your current backend code">
        <p className="mb-4 text-sm text-slate-200">
          This page shows what your backend can currently do, grouped into simple modules for an easier frontend experience.
        </p>
        <p className="text-xs text-slate-400">
          Total features: <span className="font-semibold text-white">{ENDPOINTS.length}</span>
        </p>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        {categories.map(([category, endpoints]) => (
          <Card key={category} title={category} subtitle={`${endpoints.length} available actions`}>
            <ul className="space-y-2 text-sm text-slate-200">
              {endpoints.slice(0, MAX_DISPLAYED_ENDPOINTS).map((endpoint) => (
                <li key={endpoint.id} className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2">
                  <p className="font-medium text-white">{endpoint.title}</p>
                  <p className="text-xs text-slate-300">
                    {endpoint.method} {endpoint.path}
                  </p>
                </li>
              ))}
            </ul>
            {endpoints.length > MAX_DISPLAYED_ENDPOINTS ? (
              <p className="mt-3 text-xs text-slate-400">
                ... and {endpoints.length - MAX_DISPLAYED_ENDPOINTS} more backend actions in this module.
              </p>
            ) : null}
          </Card>
        ))}
      </section>
    </div>
  );
}
