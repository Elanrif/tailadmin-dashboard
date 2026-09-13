"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/users/api/types";
import { useSession } from "./auth.context";
import { ROUTES } from "@/utils/routes";

const {
  DASHBOARD, ACCOUNT, SIGN_IN
} = ROUTES

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  guestOnly?: boolean;
  redirectTo?: string;
}

function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return DASHBOARD;
    case UserRole.USER:
    default:
      return ACCOUNT;
  }
}

export function ProtectedRoute({
  children,
  allowedRoles,
  guestOnly = false,
  redirectTo = SIGN_IN,
}: ProtectedRouteProps) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  const isWrongRole =
    !!user && !!allowedRoles && !allowedRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;

    if (guestOnly && user) {
      router.replace(getHomeRouteForRole(user.role));
      return;
    }

    if (!guestOnly && !user) {
      router.replace(redirectTo);
      return;
    }

    if (isWrongRole) {
      router.replace(getHomeRouteForRole(user!.role));
    }
  }, [user, isLoading, router, guestOnly, redirectTo, isWrongRole]);

  if (isLoading) return null;
  if (guestOnly && user) return null;
  if (!guestOnly && !user) return null;
  if (isWrongRole) return null;

  return <>{children}</>;
}
