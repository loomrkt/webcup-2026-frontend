import { z } from "zod";

export const deleteAccountSchema = z
  .object({
    confirm: z.boolean(),
    password: z.string().optional(),
    email: z.string().email("Adresse email invalide.").optional(),
  })
  .refine((value) => value.confirm, {
    message: "Vous devez confirmer la suppression de votre compte.",
    path: ["confirm"],
  })
  .refine((value) => Boolean(value.password) || Boolean(value.email), {
    message:
      "Saisissez votre mot de passe (ou votre email si vous n'avez pas de mot de passe).",
    path: ["password"],
  });

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;