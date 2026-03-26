import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "../auth.service";
import { storeTokens, getAuthToken, getRefreshToken, clearTokens } from "../../client";

// ---------------------------------------------------------------------------
// Mock fetch
// ---------------------------------------------------------------------------

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("auth.service", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearTokens();
  });

  describe("login", () => {
    it("returns access + refresh tokens and user info", async () => {
      const payload = {
        accessToken: "at-123",
        refreshToken: "rt-456",
        user: { id: "u1", username: "john", email: "john@test.com", role: "MEMBER" },
      };
      mockFetch.mockResolvedValueOnce(jsonResponse(payload));

      const result = await authService.login({ email: "john@test.com", password: "pass" });

      expect(result.accessToken).toBe("at-123");
      expect(result.refreshToken).toBe("rt-456");
      expect(result.user.username).toBe("john");
    });

    it("throws on invalid credentials", async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ message: "Invalid email or password" }, 401),
      );

      await expect(
        authService.login({ email: "bad@test.com", password: "wrong" }),
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("token storage", () => {
    it("storeTokens / getAuthToken / getRefreshToken round-trips", () => {
      storeTokens("access-abc", "refresh-xyz");

      expect(getAuthToken()).toBe("access-abc");
      expect(getRefreshToken()).toBe("refresh-xyz");
    });

    it("clearTokens removes both cookies", () => {
      storeTokens("a", "r");
      clearTokens();

      expect(getAuthToken()).toBe("");
      expect(getRefreshToken()).toBe("");
    });
  });

  describe("logout", () => {
    it("sends POST with refresh token from cookie", async () => {
      storeTokens("at-1", "rt-2");
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

      await authService.logout();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [, init] = mockFetch.mock.calls[0];
      expect(init.method).toBe("POST");
      const body = JSON.parse(init.body);
      expect(body.refreshToken).toBe("rt-2");
    });
  });

  describe("getCurrentUser", () => {
    it("returns user matching CurrentUserResponseDto shape", async () => {
      const user = {
        id: "u1",
        username: "john",
        email: "john@test.com",
        role: "MEMBER",
        accountStatus: "ACTIVE",
        createdAt: "2025-01-01T00:00:00.000Z",
      };
      mockFetch.mockResolvedValueOnce(jsonResponse(user));

      const result = await authService.getCurrentUser();

      expect(result.id).toBe("u1");
      expect(result.accountStatus).toBe("ACTIVE");
    });
  });
});
