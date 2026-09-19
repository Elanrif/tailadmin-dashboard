"use client";

import { User } from "@/lib/users/api/types";
import { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  clearAuthSession,
  getStoredAuthUser,
  storeAuthUser,
  subscribeToAuthSessionClear,
} from "@/lib/auth/auth-session";
import { logoutMutation } from "@/lib/auth/api/mutation";
import {
  signOut as authSignOut,
  useSession as useAuthSession,
} from "next-auth/react";
import { myProfileQueryOptions } from "@/lib/account/api/queries/queries.client";

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const authSession = useAuthSession();
  const isKeycloak =
    process.env.NEXT_PUBLIC_AUTH_PROVIDER === "keycloak";
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
    if (isKeycloak) {
      void authSignOut({ callbackUrl: "/sign-in" });
      return;
    }

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

  const { data: meUser, isLoading: meLoading } = useQuery({
    ...myProfileQueryOptions(),
    enabled: isKeycloak && authSession.status === "authenticated",
  });

  const sessionUser = isKeycloak ? (meUser ?? null) : user;
  const sessionLoading = isKeycloak
    ? authSession.status === "loading" || meLoading
    : isLoading;

  return (
    <SessionContext.Provider
      value={{
        user: sessionUser,
        isLoading: sessionLoading,
        setUser,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside AuthUserProvider");
  return ctx;
}
