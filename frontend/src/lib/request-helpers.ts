import { HttpMethod } from "@/lib/endpoints";

export function methodColor(method: HttpMethod): string {
  if (method === "GET") return "bg-emerald-400/20 text-emerald-200";
  if (method === "POST") return "bg-sky-400/20 text-sky-200";
  if (method === "PUT") return "bg-amber-400/20 text-amber-200";
  return "bg-rose-400/20 text-rose-200";
}

export function resolvePath(
  template: string,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>,
): { path: string; missingParam: string | null } {
  const requiredPathParamKeys = Array.from(template.matchAll(/\{([^}]+)\}/g)).map((match) => match[1]);
  const missingParam = requiredPathParamKeys.find((key) => !(pathParams[key] ?? "").trim());
  if (missingParam) {
    return { path: template, missingParam };
  }

  const withParams = template.replace(/\{([^}]+)\}/g, (_, key: string) =>
    encodeURIComponent((pathParams[key] ?? "").trim()),
  );

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value.trim()) {
      query.set(key, value.trim());
    }
  }

  const queryString = query.toString();
  return { path: queryString ? `${withParams}?${queryString}` : withParams, missingParam: null };
}

export function extractToken(response: unknown): string {
  if (typeof response === "string") {
    return response.replace(/^"|"$/g, "").trim();
  }

  if (hasTokenField(response)) {
    return typeof response.token === "string" ? response.token.trim() : "";
  }

  return "";
}

function hasTokenField(value: unknown): value is { token?: unknown } {
  return typeof value === "object" && value !== null && "token" in value;
}

export function toPrettyResponse(value: unknown): string {
  if (typeof value === "string") {
    const parsed = tryParseJson(value);
    return parsed === undefined ? value : JSON.stringify(parsed, null, 2);
  }

  if (value === undefined) {
    return "No content";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function tryParseJson(value: string): unknown | undefined {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Request failed.";
}

export function isTokenExpired(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return true;
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
