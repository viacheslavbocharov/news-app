const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export interface ApiError extends Error {
  status?: number;
  code?: string;
  raw?: unknown;
}

function parseJsonSafe<T = unknown>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const hasBody = init.body !== undefined && init.body !== null;

  if (hasBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch (networkErr) {
    const err: ApiError = new Error("Network error");
    err.status = 0;
    err.code = "NETWORK_ERROR";
    err.raw = networkErr;
    throw err;
  }

  const ct = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");

  if (res.status === 204 || res.status === 304) {
    if (!res.ok) {
      const err: ApiError = new Error(res.statusText || `HTTP ${res.status}`);
      err.status = res.status;
      err.code = "HTTP_ERROR";
      throw err;
    }
    return null as T;
  }

  const text = await res.text();
  const data = isJson && text ? parseJsonSafe<unknown>(text) : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "message" in data
        ? (data as { message: string }).message
        : res.statusText) || `HTTP ${res.status}`;
    const code =
      (data && typeof data === "object" && "code" in data
        ? (data as { code: string }).code
        : "HTTP_ERROR");

    const err: ApiError = new Error(msg);
    err.status = res.status;
    err.code = code;
    err.raw = !isJson ? text : data;
    throw err;
  }

  return (isJson ? (data as T) : (null as T));
}