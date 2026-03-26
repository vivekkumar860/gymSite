"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { CurrentUser } from "@/api/services/auth.service";
import * as authService from "@/api/services/auth.service";
import { clearTokens } from "@/api/client";
import { queryKeys } from "@/config/query-keys";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuthState = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user = null,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await authService.login({ email, password });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(),
      });
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Best-effort server-side logout — clear local state regardless
    }
    clearTokens();
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.user.profile(),
    });
  }, [queryClient]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
