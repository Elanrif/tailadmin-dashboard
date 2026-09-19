import NextAuth, { type DefaultSession } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";
import { UserRole } from "@/lib/users/api/types";
import environment from "@/config/environment.config";

type KeycloakProfile = {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles?: string[] };
};

const {
  api: { backendUrl },
  auth: {
    trustHost,
    keycloak: { clientId, clientSecret, issuer },
  },
} = environment;

function mapRolesToUserRole(roles: string[] = []): UserRole {
  return roles.some((role) => role.toUpperCase().includes("ADMIN"))
    ? UserRole.ADMIN
    : UserRole.USER;
}

// realm_access.roles n'est fiable que sur l'access_token (le "profile" issu de
// l'id_token/userinfo ne le contient pas forcément selon la config des mappers
// Keycloak). On décode donc l'access_token lui-même, sans vérifier la
// signature : NextAuth a déjà validé ce token en l'obtenant directement du
// token_endpoint via TLS, ce n'est pas une donnée qui transite par le client.
function extractRealmRoles(accessToken?: string): string[] {
  if (!accessToken) return [];
  try {
    const payload = accessToken.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    ) as { realm_access?: { roles?: string[] } };
    return decoded.realm_access?.roles ?? [];
  } catch {
    return [];
  }
}

// Le sub Keycloak est un UUID, pas l'id (Long) de la table `users` en Postgres.
// Ces deux espaces d'identifiants sont indépendants — on ne peut pas les
// convertir l'un en l'autre. La seule source fiable de l'id DB est le
// backend lui-même : le JitProvisioningFilter y crée/retrouve l'utilisateur
// par email, et GET /api/v1/account (SecurityUtils.getCurrentUser()) le
// résout de la même façon, que l'auth soit une session ou un JWT Keycloak.
async function fetchDbUser(accessToken: string) {
  const apiUrl = backendUrl;
  const response = await fetch(`${apiUrl}/api/v1/account`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Impossible de récupérer le profil DB (status ${response.status})`,
    );
  }

  return (await response.json()) as {
    id: number;
    firstName?: string;
    lastName?: string;
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${issuer}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: token.refresh_token ?? "",
        }),
      },
    );

    const refreshed = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
    };

    if (!response.ok || !refreshed.access_token) {
      throw new Error("Unable to refresh the Keycloak access token");
    }

    return {
      ...token,
      access_token: refreshed.access_token,
      expires_at: Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 0),
      refresh_token: refreshed.refresh_token ?? token.refresh_token,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Keycloak({
      clientId: clientId,
      clientSecret: clientSecret,
      issuer: issuer,
    }),
    // Même client Keycloak, mais pointé sur /registrations au lieu de /auth,
    // pour le bouton "Sign up". NextAuth génère PKCE + state normalement pour
    // ce provider aussi — c'est ça qui manquait dans la route custom
    // /api/auth/keycloak/register (voir InvalidCheck: pkceCodeVerifier).
    // Callback attendu côté Keycloak : /api/auth/callback/keycloak-register
    // (à ajouter dans "Valid redirect URIs" du client, en plus de l'existant).
    Keycloak({
      id: "keycloak-register",
      name: "Keycloak (register)",
      clientId: clientId,
      clientSecret: clientSecret,
      issuer: issuer,
      authorization: {
        url: `${(issuer).replace(/\/$/, "")}/protocol/openid-connect/registrations`,
      },
    }),
  ],
  trustHost: trustHost,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const keycloakProfile = profile as KeycloakProfile | undefined;
        const roles = extractRealmRoles(account.access_token);

        let dbUserId: number | undefined;
        try {
          const dbUser = await fetchDbUser(account.access_token!);
          dbUserId = dbUser.id;
        } catch {
          // Le JIT provisioning peut avoir une latence (création de la ligne
          // User en base côté Spring au tout premier login) — dbUserId reste
          // undefined, session.user.id sera "" et le reste de l'app doit
          // gérer ce cas (voir isLoading côté client).
        }

        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at:
            account.expires_at ??
            Math.floor(Date.now() / 1000) + (account.expires_in ?? 0),
          role: mapRolesToUserRole(roles),
          firstName: keycloakProfile?.given_name,
          lastName: keycloakProfile?.family_name,
          dbUserId,
        };
      }

      if (token.expires_at && Date.now() < token.expires_at * 1000 - 60_000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.dbUserId != null ? String(token.dbUserId) : "";
        session.user.role = token.role ?? UserRole.USER;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.expires_at = token.expires_at;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    user: {
      id: string;
      role: UserRole;
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    dbUserId?: number;
    error?: string;
  }
}
