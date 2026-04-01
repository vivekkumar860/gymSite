import { ZodSchema } from "zod";
import { env } from "@/config/env";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QueryParams = Record<string, string | number | boolean | undefined>;

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string | string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string | string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers (single source of truth for token storage)
// ---------------------------------------------------------------------------

const AUTH_COOKIE = "auth_token";
const REFRESH_COOKIE = "refresh_token";
const COOKIE_MAX_AGE_SECS = 60 * 60 * 24 * 30; // 30 days — matches backend refresh TTL

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE_SECS) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthToken(): string {
  return getCookie(AUTH_COOKIE);
}

export function getRefreshToken(): string {
  return getCookie(REFRESH_COOKIE);
}

export function storeTokens(accessToken: string, refreshToken: string) {
  setCookie(AUTH_COOKIE, accessToken);
  setCookie(REFRESH_COOKIE, refreshToken);
}

export function clearTokens() {
  deleteCookie(AUTH_COOKIE);
  deleteCookie(REFRESH_COOKIE);
}

// ---------------------------------------------------------------------------
// URL / header helpers
// ---------------------------------------------------------------------------

function buildUrl(path: string, params?: QueryParams): string {
  const base = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "");
  const url = new URL(`${base}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// Response handling
// ---------------------------------------------------------------------------

async function handleResponse<T>(
  response: Response,
  schema?: ZodSchema<T>,
): Promise<T> {
  if (!response.ok) {
    let body: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      body = await response.json();
    } catch {
      // response may not be JSON
    }
    const msg =
      typeof body.message === "string"
        ? body.message
        : Array.isArray(body.message)
          ? body.message.filter((m): m is string => typeof m === "string").join(". ")
          : response.statusText;
    throw new ApiError(response.status, msg, body.errors);
  }

  // For 204 No Content or when no schema is provided, return undefined as T
  if (response.status === 204 || !schema) {
    return undefined as T;
  }

  const json = await response.json();
  return schema.parse(json);
}

// ---------------------------------------------------------------------------
// 401 refresh-and-retry logic
// ---------------------------------------------------------------------------

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const url = buildUrl("/auth/refresh");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;

    const data = await res.json();
    storeTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

async function refreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = tryRefreshToken().finally(() => {
      setTimeout(() => {
        refreshPromise = null;
      }, 100);
    });
  }
  return refreshPromise;
}

async function fetchWithRefresh(
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status !== 401) return response;

  const refreshed = await refreshOnce();
  if (!refreshed) {
    // Tokens are dead — clear and let the caller handle the 401
    clearTokens();
    return response;
  }

  // Retry with new access token
  const retryHeaders = { ...init.headers, ...authHeaders() };
  return fetch(input, { ...init, headers: retryHeaders });
}

// ---------------------------------------------------------------------------
// API Client
// ---------------------------------------------------------------------------

export const apiClient = {
  async get<T>(
    path: string,
    schema: ZodSchema<T>,
    params?: QueryParams,
  ): Promise<T> {
    const url = buildUrl(path, params);
    const response = await fetchWithRefresh(url, {
      method: "GET",
      headers: authHeaders(),
    });
    return handleResponse(response, schema);
  },

  async post<T = void>(
    path: string,
    body: unknown,
    schema?: ZodSchema<T>,
  ): Promise<T> {
    const url = buildUrl(path);
    const response = await fetchWithRefresh(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response, schema);
  },

  async put<T>(
    path: string,
    body: unknown,
    schema: ZodSchema<T>,
  ): Promise<T> {
    const url = buildUrl(path);
    const response = await fetchWithRefresh(url, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response, schema);
  },

  async patch<T>(
    path: string,
    body: unknown,
    schema: ZodSchema<T>,
  ): Promise<T> {
    const url = buildUrl(path);
    const response = await fetchWithRefresh(url, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response, schema);
  },

  async delete(path: string): Promise<void> {
    const url = buildUrl(path);
    const response = await fetchWithRefresh(url, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handleResponse<void>(response);
  },
};
