import { isAxiosError } from "axios";

export interface AuthApiEnvelope<T> {
  success: boolean;
  data: T;
  code: string;
  message: string;
  meta: null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSessionUser {
  id: string;
  email: string;
}

export interface LoginData extends AuthSessionUser, AuthTokens {
  requiresTwoFactor: boolean;
  pendingToken?: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = data?.message;
    if (typeof message === "string" && message) return message;
    if (Array.isArray(message) && message[0]) return String(message[0]);
    if (error.response?.status === 429)
      return "Trop de tentatives. Réessayez dans quelques minutes.";
    if (error.code === "ERR_NETWORK")
      return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  return fallback;
}

export function isEmailNotVerifiedError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  const message = (error.response?.data as { message?: string } | undefined)?.message;
  if (status === 403) return true;
  if (typeof message === "string") {
    return /email\s+not\s+verified|verif/i.test(message);
  }
  return false;
}