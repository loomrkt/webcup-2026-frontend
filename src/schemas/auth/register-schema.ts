import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const registerPayloadSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis.")
    .email("Adresse email invalide."),
  password: passwordSchema,
});

export const registerFormSchema = registerPayloadSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerPayloadSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;