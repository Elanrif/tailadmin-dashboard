"use client";

import { toast } from "sonner";
import type { useRouter } from "next/navigation";
import type { ApiError } from "./api-error";
import { ROUTES } from "@/utils/routes";
import { clearAuthSession } from "../auth/auth-session";

export function handleApiError(
  error: ApiError,
  router: ReturnType<typeof useRouter>,
) {
  if (error.status === 401) {
    clearAuthSession();
    router.push(ROUTES.SIGN_IN);
    toast.error("Votre session a expiré, veuillez vous reconnecter.");
    return;
  }
  toast.error(error.message);
}
