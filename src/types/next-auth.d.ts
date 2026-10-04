// types/next-auth.d.ts
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    accessToken: string
    refreshToken: string
  }
  interface Session {
    accessToken: string
    refreshToken: string
    error?: "RefreshTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    error?: "RefreshTokenError"
  }
}