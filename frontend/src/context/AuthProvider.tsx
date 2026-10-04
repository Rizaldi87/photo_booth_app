import { useCallback, useEffect, useState } from "react";
import type { User } from "../types/UserType";
import { getCsrfCookie, login as loginApi, logout as logoutApi, me as meApi } from "../lib/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await meApi();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await getCsrfCookie();
      const data = await loginApi(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login gagal";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const data = await meApi();

        if (cancelled) return;

        setUser(data.user);
        setIsAuthenticated(true);
      } catch {
        if (cancelled) return;

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>{children}</AuthContext.Provider>;
}
