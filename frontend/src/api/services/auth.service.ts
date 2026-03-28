import { apiClient, getRefreshToken } from "@/api/client";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth-specific schemas (match backend response shapes exactly)
// ---------------------------------------------------------------------------

const authUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
});

const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: authUserSchema,
});

type AuthResponse = z.infer<typeof authResponseSchema>;

const currentUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  accountStatus: z.string(),
  createdAt: z.string(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

// ---------------------------------------------------------------------------
// Auth Service
// ---------------------------------------------------------------------------

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiClient.post("/auth/login", credentials, authResponseSchema);
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiClient.post("/auth/register", data, authResponseSchema);
}

export async function logout(): Promise<void> {
  const rt = getRefreshToken();
  await apiClient.post("/auth/logout", { refreshToken: rt });
}

export async function refreshToken(
  currentRefreshToken: string,
): Promise<AuthResponse> {
  return apiClient.post(
    "/auth/refresh",
    { refreshToken: currentRefreshToken },
    authResponseSchema,
  );
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiClient.get("/auth/me", currentUserSchema);
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete("/auth/me");
}
