"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/users/api/types";
import { useSession } from "./auth.context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  guestOnly?: boolean; // 👈 Nouvelle option pour le layout (auth)
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  guestOnly = false,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // CAS 1 : La page est réservée aux NON-connectés (ex: /sign-in, /sign-up)
    if (guestOnly && user) {
      router.replace("/dashboard"); // Bloque l'accès au layout (auth) et redirige
      return;
    }

    // CAS 2 : La page est réservée aux connectés et l'utilisateur n'est pas là
    if (!guestOnly && !user) {
      router.replace(redirectTo);
      return;
    }

    // CAS 3 : La page est réservée aux Admins et l'utilisateur est un simple user
    if (adminOnly && user?.role !== UserRole.ADMIN) {
      router.replace("/account");
    }
  }, [user, isLoading, router, adminOnly, guestOnly, redirectTo]);

  // Pendant le chargement, on ne montre rien pour éviter les flashs d'écran
  if (isLoading) return null;

  // Sécurité d'affichage (Rendu)
  if (guestOnly && user) return null;
  if (!guestOnly && !user) return null;
  if (adminOnly && user?.role !== UserRole.ADMIN) return null;

  return <>{children}</>;
}
