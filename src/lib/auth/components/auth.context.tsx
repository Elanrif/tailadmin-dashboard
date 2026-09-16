"use client";

import { User } from "@/lib/users/api/types";
import { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  clearAuthSession,
  getStoredAuthUser,
  storeAuthUser,
  subscribeToAuthSessionClear,
} from "@/lib/auth/auth-session";
import { logoutMutation } from "@/lib/auth/api/mutation";

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthSessionClear(() => setUserState(null));
    let timeoutId: number;

    try {
      const stored = getStoredAuthUser();
      const storedUser = stored ? (JSON.parse(stored) as User) : null;
      timeoutId = window.setTimeout(() => {
        setUserState(storedUser);
        setIsLoading(false);
      }, 0);
    } catch {
      timeoutId = window.setTimeout(() => {
        setUserState(null);
        setIsLoading(false);
      }, 0);
    }

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const setUser = (u: User) => {
    setUserState(u);
    storeAuthUser(u);
  };

  const logoutMutationHook = useMutation(logoutMutation);
  const signOut = () => {
    logoutMutationHook.mutate(undefined, {
      onSuccess: () => {
        clearAuthSession();
        setUserState(null);
      },
      onError: () => {
        clearAuthSession();
        setUserState(null);
      },
    });
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, setUser, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside AuthUserProvider");
  return ctx;
}
