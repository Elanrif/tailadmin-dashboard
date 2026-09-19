import { NextResponse } from "next/server";
import { signIn } from "../../../../../../auth";

export async function GET(request: Request) {
  const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
  const clientId = process.env.AUTH_KEYCLOAK_ID;

  if (!issuer || !clientId) {
    return NextResponse.json(
      { error: "Keycloak registration is not configured" },
      { status: 500 },
    );
  }

  const requestUrl = new URL(request.url);

  // Keycloak refuse l'inscription tant qu'une session SSO est active. Le
  // premier aller déconnecte la session Keycloak existante, puis revient ici
  // avec ?logged_out=1 pour lancer le vrai flow d'inscription.
  if (requestUrl.searchParams.get("logged_out") !== "1") {
    const logoutUrl = new URL(
      `${issuer.replace(/\/$/, "")}/protocol/openid-connect/logout`,
    );
    const restartUrl = new URL(request.url);
    restartUrl.search = "?logged_out=1";

    logoutUrl.search = new URLSearchParams({
      client_id: clientId,
      post_logout_redirect_uri: restartUrl.toString(),
    }).toString();

    return NextResponse.redirect(logoutUrl);
  }

  // On laisse NextAuth démarrer le vrai flow OAuth (PKCE + state générés et
  // stockés correctement dans les cookies) vers le provider dédié
  // "keycloak-register" (voir auth.ts), qui pointe sur
  // /protocol/openid-connect/registrations au lieu de /auth.
  return signIn("keycloak-register", { redirectTo: "/dashboard" });
}
