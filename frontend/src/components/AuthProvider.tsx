"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { fetchUser, logoutUser } from "@/lib/apilogin";
import { User } from "@/types/types";

interface AuthContextType {
  user: User | null | undefined;
  login: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isFetching: boolean;
  reloadUser: () => Promise<void>;
  decodedRole: string | null;
}

interface AuthContextType {
  user: User | null | undefined;
  login: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isFetching: boolean;
  reloadUser: () => Promise<void>;
  decodedRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const router = useRouter();
  const isFetchingRef = useRef<boolean>(false);

  const ENABLE_AUTO_REFRESH = true;

  const safeRequestIdleCallback = useMemo(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      return window.requestIdleCallback;
    }
    return (cb: IdleRequestCallback) => setTimeout(cb, 0);
  }, []);

  const loadUser = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsFetching(true);

    const userData = await fetchUser();
    setUser(userData ?? null);

    setIsFetching(false);
    isFetchingRef.current = false;
  }, []);

  const reloadUser = useCallback(async () => {
    if (!isFetchingRef.current) {
      await loadUser();
    }
  }, [isFetchingRef, loadUser]);

  useEffect(() => {
    loadUser();

    if (!ENABLE_AUTO_REFRESH) return;

    const interval = setInterval(() => {
      if (!isFetchingRef.current) {
        safeRequestIdleCallback(() => {
          loadUser();
        });
      }
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadUser, ENABLE_AUTO_REFRESH, safeRequestIdleCallback]);

  const login = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const userData = await fetchUser();

    if (userData) {
      setUser(userData);
      router.push("/home");
      return { success: true };
    } else {
      return { success: false, error: "Invalid session or user not found" };
    }
  }, [router]);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  let decodedRole: string | null = null;
  try {
    decodedRole = user?.username ? user.username.toString() : null;
  } catch {
    decodedRole = null;
  }

  const authValue = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      isFetching,
      reloadUser,
      decodedRole,
    }),
    [user, login, logout, isFetching, reloadUser, decodedRole]
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
