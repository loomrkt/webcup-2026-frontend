import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

interface AuthApiEnvelope {
  success: boolean;
  data: {
    id?: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
    requiresTwoFactor?: boolean;
    pendingToken?: string;
  };
  code: string;
  message: string;
}

interface MeEnvelope {
  success: boolean;
  data?: { id?: string; email?: string } | null;
}

function getJwtExpiryMs(jwt: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64").toString("utf-8"),
    );
    return payload.exp ? payload.exp * 1000 : Date.now() + 15 * 60 * 1000;
  } catch {
    return Date.now() + 15 * 60 * 1000;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      },
    );

    if (!response.ok) throw new Error("RefreshFailed");

    const json: AuthApiEnvelope = await response.json();

    if (!json.success) throw new Error("RefreshFailed");

    return {
      ...token,
      accessToken: json.data.accessToken,
      refreshToken: json.data.refreshToken ?? token.refreshToken,
      accessTokenExpiresAt: getJwtExpiryMs(json.data.accessToken),
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        if (!response.ok) return null;

        const json: AuthApiEnvelope = await response.json();

        if (!json.success) return null;

        const { id, email, accessToken, refreshToken, requiresTwoFactor } =
          json.data;

        if (requiresTwoFactor) return null;

        return {
          id: id ?? email ?? "",
          email: email ?? "",
          accessToken,
          refreshToken,
        };
      },
    }),
    Credentials({
      id: "token-session",
      name: "Token session",
      credentials: {
        accessToken: {},
        refreshToken: {},
      },
      async authorize(credentials) {
        const { accessToken, refreshToken } = credentials ?? {};
        if (!accessToken || typeof accessToken !== "string") return null;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (!response.ok) return null;

        const json: MeEnvelope = await response.json();
        if (!json.success || !json.data) return null;

        return {
          id: json.data.id ?? "",
          email: json.data.email ?? "",
          accessToken,
          refreshToken:
            typeof refreshToken === "string" ? refreshToken : "",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Premier login : user est défini
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiresAt: getJwtExpiryMs(user.accessToken as string),
        };
      }

      // Token encore valide
      if (Date.now() < token.accessTokenExpiresAt) return token;

      // Refresh déjà échoué : ne pas réessayer
      if (token.error === "RefreshTokenError") return token;

      // Refresh
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.email = token.email as string;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});