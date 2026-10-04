import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis.")
    .email("Adresse email invalide."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;