import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Votre nom est requis.")
    .max(120, "Le nom est trop long."),
  email: z
    .string()
    .min(1, "L'adresse email est requise.")
    .email("Adresse email invalide."),
  subject: z.string().max(160, "L'objet est trop long."),
  category: z.string(),
  message: z
    .string()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(10_000, "Le message est trop long."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;