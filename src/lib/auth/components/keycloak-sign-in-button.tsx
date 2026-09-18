"use client";

import { signIn } from "next-auth/react";

export default function KeycloakSignInButton() {
  return (
    <button
      type="button"
      onClick={() => void signIn("keycloak", { callbackUrl: "/" })}
      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600"
    >
      Sign in with Keycloak
    </button>
  );
}
