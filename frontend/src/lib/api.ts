export const API_PREFIX = "/backend";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiRequestOptions = Omit<RequestInit, "headers" | "body"> & {
  token?: string;
  body?: unknown;
};

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, body, ...rest } = options;

  const headers: HeadersInit = {
    Accept: "application/json, text/plain, */*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let payload: BodyInit | undefined;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${API_PREFIX}${path}`, {
    ...rest,
    headers,
    body: payload,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new ApiError(text || "Request failed", response.status);
  }

  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
