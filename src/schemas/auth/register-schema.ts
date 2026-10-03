import { z } from "zod";

export const registerPayloadSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
});

export const registerFormSchema = registerPayloadSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerPayloadSchema>;