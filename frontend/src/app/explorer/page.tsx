"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useClientSession } from "@/lib/client-session";
import { ENDPOINTS, EndpointDefinition } from "@/lib/endpoints";
import { getErrorMessage, methodColor, resolvePath, toPrettyResponse } from "@/lib/request-helpers";
import { Card, Input, PrimaryButton } from "@/components/ui";

export default function ExplorerPage() {
  const initialEndpoint = ENDPOINTS[0];
  const { token, status, setStatus, setResponseText } = useClientSession();

  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEndpointId, setSelectedEndpointId] = useState(initialEndpoint?.id ?? "");
  const [pathParams, setPathParams] = useState<Record<string, string>>({
    ...(initialEndpoint?.defaultPathParams ?? {}),
  });
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    ...(initialEndpoint?.defaultQueryParams ?? {}),
  });
  const [bodyText, setBodyText] = useState(
    initialEndpoint?.bodyTemplate === undefined ? "" : JSON.stringify(initialEndpoint.bodyTemplate, null, 2),
  );

  const selectedEndpoint = ENDPOINTS.find((endpoint) => endpoint.id === selectedEndpointId) ?? ENDPOINTS[0];

  const categories = useMemo(() => {
    const unique = new Set(ENDPOINTS.map((endpoint) => endpoint.category));
    return ["All", ...Array.from(unique)];
  }, []);

  const filteredEndpoints = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return ENDPOINTS.filter((endpoint) => {
      const matchesCategory = category === "All" || endpoint.category === category;
      const matchesSearch =
        !normalized ||
        endpoint.title.toLowerCase().includes(normalized) ||
        endpoint.path.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  function applyEndpointSelection(endpoint: EndpointDefinition) {
    setSelectedEndpointId(endpoint.id);
    setPathParams({ ...(endpoint.defaultPathParams ?? {}) });
    setQueryParams({ ...(endpoint.defaultQueryParams ?? {}) });
    setBodyText(endpoint.bodyTemplate === undefined ? "" : JSON.stringify(endpoint.bodyTemplate, null, 2));
  }

  async function runSelectedEndpoint() {
    if (!selectedEndpoint) return;

    if (selectedEndpoint.contentType === "multipart/form-data") {
      setStatus("This endpoint is multipart. Open Image Upload page.");
      return;
    }

    if (!selectedEndpoint.isPublic && !token) {
      setStatus("This endpoint requires login token.");
      return;
    }

    const resolved = resolvePath(selectedEndpoint.path, pathParams, queryParams);
    if (resolved.missingParam) {
      setStatus(`Path parameter '${resolved.missingParam}' is required.`);
      return;
    }

    let parsedBody: unknown = undefined;
    const shouldSendBody = selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT";

    if (shouldSendBody && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch {
        setStatus("Request body must be valid JSON.");
        return;
      }
    }

    try {
      setBusy(true);
      const result = await apiRequest<unknown>(resolved.path, {
        method: selectedEndpoint.method,
        token: selectedEndpoint.isPublic ? undefined : token,
        body: parsedBody,
      });
      setResponseText(toPrettyResponse(result));
      setStatus(`${selectedEndpoint.method} ${resolved.path} executed successfully.`);
    } catch (error) {
      setStatus(getErrorMessage(error));
      setResponseText("Request failed. Check status message.");
    } finally {
      setBusy(false);
    }
  }

  const pathParamKeys = Object.keys(pathParams);
  const queryParamKeys = Object.keys(queryParams);
  const resolvedPathPreview = selectedEndpoint
    ? resolvePath(selectedEndpoint.path, pathParams, queryParams)
    : { path: "", missingParam: null as string | null };

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
        {status}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card title="Endpoint Catalog" subtitle="All backend methods, page by page workflow">
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Input placeholder="Search endpoint" value={search} onChange={setSearch} />
          </div>

          <div className="grid max-h-[38rem] gap-3 overflow-auto pr-1">
            {filteredEndpoints.map((endpoint) => {
              const active = endpoint.id === selectedEndpoint?.id;
              return (
                <button
                  key={endpoint.id}
                  type="button"
                  onClick={() => applyEndpointSelection(endpoint)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active ? "border-cyan-300 bg-cyan-400/15" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{endpoint.title}</h3>
                    <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${methodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  </div>
                  <p className="mt-2 break-all text-xs text-cyan-100">{endpoint.path}</p>
                  <p className="mt-2 text-xs text-slate-300">{endpoint.description}</p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    {endpoint.isPublic ? "Public" : "JWT required"} • {endpoint.category}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          title="API Workstation"
          subtitle={selectedEndpoint ? `${selectedEndpoint.method} ${selectedEndpoint.path}` : "Select endpoint"}
        >
          {selectedEndpoint.contentType === "multipart/form-data" ? (
            <p className="mb-3 rounded-xl border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
              This endpoint requires multipart form data. Use the <Link href="/upload" className="underline">Image Upload</Link> page.
            </p>
          ) : null}

          {pathParamKeys.length > 0 ? (
            <div className="mb-3 grid gap-2">
              <p className="text-xs uppercase tracking-wider text-slate-400">Path Params</p>
              {pathParamKeys.map((key) => (
                <Input
                  key={key}
                  placeholder={key}
                  value={pathParams[key] ?? ""}
                  onChange={(value) => setPathParams((prev) => ({ ...prev, [key]: value }))}
                />
              ))}
            </div>
          ) : null}

          {queryParamKeys.length > 0 ? (
            <div className="mb-3 grid gap-2">
              <p className="text-xs uppercase tracking-wider text-slate-400">Query Params</p>
              {queryParamKeys.map((key) => (
                <Input
                  key={key}
                  placeholder={key}
                  value={queryParams[key] ?? ""}
                  onChange={(value) => setQueryParams((prev) => ({ ...prev, [key]: value }))}
                />
              ))}
            </div>
          ) : null}

          {(selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT") &&
          selectedEndpoint.contentType !== "multipart/form-data" ? (
            <div className="mb-3 grid gap-2">
              <p className="text-xs uppercase tracking-wider text-slate-400">JSON Body</p>
              <textarea
                value={bodyText}
                onChange={(event) => setBodyText(event.target.value)}
                rows={10}
                className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs outline-none focus:border-cyan-300"
              />
            </div>
          ) : null}

          <div className="flex gap-2">
            <PrimaryButton
              type="button"
              onClick={runSelectedEndpoint}
              disabled={busy || selectedEndpoint.contentType === "multipart/form-data"}
            >
              Execute
            </PrimaryButton>
            <button
              type="button"
              onClick={() => applyEndpointSelection(selectedEndpoint)}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Reset Template
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/80 p-3">
            <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Resolved Path</p>
            <p className="break-all text-sm text-cyan-200">
              {resolvedPathPreview.missingParam
                ? `Missing path parameter: ${resolvedPathPreview.missingParam}`
                : resolvedPathPreview.path}
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
