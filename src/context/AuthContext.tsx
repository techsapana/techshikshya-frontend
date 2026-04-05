"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DOMAIN } from "@/src/env";

type UserRole = "ADMIN" | "USER" | string;

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  provider: string;
}

interface CurrentUserApiResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${DOMAIN}/api/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as CurrentUserApiResponse;
    if (!json?.success || !json.data) {
      return null;
    }

    return json.data;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${DOMAIN}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        await fetch(`${DOMAIN}/api/auth/logout`, {
          method: "GET",
          credentials: "include",
        });
      }
    } catch {
      // Keep logout resilient even if endpoint/network fails.
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      refreshUser,
      logout,
    }),
    [isLoading, logout, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
