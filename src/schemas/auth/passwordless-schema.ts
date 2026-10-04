import { z } from "zod";

export const passwordlessRequestSchema = z.object({
  email: z.string().email("Adresse email invalide."),
});

export const passwordlessVerifySchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres."),
});

export type PasswordlessRequestInput = z.infer<
  typeof passwordlessRequestSchema
>;
export type PasswordlessVerifyInput = z.infer<typeof passwordlessVerifySchema>;