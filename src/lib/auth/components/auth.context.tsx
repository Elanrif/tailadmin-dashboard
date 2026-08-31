"use client";

import { User } from "@/lib/users/api/types";
import { createContext, useContext, useState, useEffect } from "react";

const AUTH_KEY = "auth_user";

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
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      setTimeout(
        () => setUserState(stored ? (JSON.parse(stored) as User) : null),
        0,
      );
    } catch {
      setTimeout(() => setUserState(null), 0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUser = (u: User) => {
    setUserState(u);
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  };

  const signOut = () => {
    setUserState(null);
    localStorage.removeItem(AUTH_KEY);
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
