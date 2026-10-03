import { isAxiosError } from "axios";

/** Extrait le message d'erreur du backend (enveloppe ApiResponse) avec repli. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const message = data?.message;
    if (typeof message === "string" && message) return message;
    if (Array.isArray(message) && message[0]) return String(message[0]);
    if (error.response?.status === 404) return "Introuvable.";
    if (error.response?.status === 409)
      return "Cette action a déjà été effectuée.";
    if (error.code === "ERR_NETWORK")
      return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  return fallback;
}