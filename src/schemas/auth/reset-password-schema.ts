import { z } from "zod";
import { passwordSchema } from "./password-schema";
import { emailVerificationTokenSchema } from "./verify-email-schema";

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

export const resetPasswordPayloadSchema = z.object({
  token: emailVerificationTokenSchema,
  password: passwordSchema,
});

export type ResetPasswordPayloadInput = z.infer<
  typeof resetPasswordPayloadSchema
>;