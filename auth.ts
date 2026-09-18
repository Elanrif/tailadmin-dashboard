import NextAuth, { type DefaultSession } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";
import { UserRole } from "@/lib/users/api/types";

type KeycloakProfile = {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles?: string[] };
};

function mapRolesToUserRole(roles: string[] = []): UserRole {
  return roles.some((role) => role.toUpperCase().includes("ADMIN"))
    ? UserRole.ADMIN
    : UserRole.USER;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AUTH_KEYCLOAK_ID ?? "",
          client_secret: process.env.AUTH_KEYCLOAK_SECRET ?? "",
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
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const keycloakProfile = profile as KeycloakProfile | undefined;
        const roles = keycloakProfile?.realm_access?.roles ?? [];

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
        };
      }

      if (token.expires_at && Date.now() < token.expires_at * 1000 - 60_000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
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
    error?: string;
  }
}
