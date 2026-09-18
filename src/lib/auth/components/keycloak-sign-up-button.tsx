"use client";

export default function KeycloakSignUpButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.assign("/api/auth/keycloak/register");
      }}
      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600"
    >
      Sign up with Keycloak
    </button>
  );
}
