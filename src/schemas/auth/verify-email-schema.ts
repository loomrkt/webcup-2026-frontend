import { z } from "zod";

export const emailVerificationTokenSchema = z
  .string()
  .min(1, "Jeton de vérification manquant.")
  .regex(/^[a-f0-9]{64}$/i, "Jeton de vérification invalide.");

export const verifyEmailSchema = z.object({
  token: emailVerificationTokenSchema,
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;