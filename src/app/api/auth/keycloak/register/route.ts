import { NextResponse } from "next/server";

export function GET(request: Request) {
  const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
  const clientId = process.env.AUTH_KEYCLOAK_ID;
  const applicationUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!issuer || !clientId || !applicationUrl) {
    return NextResponse.json(
      { error: "Keycloak registration is not configured" },
      { status: 500 },
    );
  }

  const registrationUrl = new URL(
    `${issuer.replace(/\/$/, "")}/protocol/openid-connect/registrations`,
  );
  const callbackUrl = `${applicationUrl.replace(/\/$/, "")}/api/auth/callback/keycloak`;
  const requestUrl = new URL(request.url);

  registrationUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "openid",
    redirect_uri: callbackUrl,
  }).toString();

  // Keycloak refuses registration while an SSO session is active. The first
  // request logs out the current Keycloak user; the callback then starts the
  // registration flow without an authenticated Keycloak session.
  if (requestUrl.searchParams.get("logged_out") !== "1") {
    const logoutUrl = new URL(
      `${issuer.replace(/\/$/, "")}/protocol/openid-connect/logout`,
    );
    const registrationStartUrl = new URL(request.url);
    registrationStartUrl.search = "?logged_out=1";

    logoutUrl.search = new URLSearchParams({
      client_id: clientId,
      post_logout_redirect_uri: registrationStartUrl.toString(),
    }).toString();

    return NextResponse.redirect(logoutUrl);
  }

  return NextResponse.redirect(registrationUrl);
}
