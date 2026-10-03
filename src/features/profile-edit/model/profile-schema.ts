import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().max(80, "Le prénom est trop long."),
  lastName: z.string().max(80, "Le nom est trop long."),
  phone: z.string().max(30, "Le numéro de téléphone est trop long."),
  address: z.string().max(200, "L'adresse est trop longue."),
  city: z.string().max(100, "La ville est trop longue."),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const PROFILE_FIELD_LABELS: Record<keyof ProfileFormValues, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  phone: "Téléphone",
  address: "Adresse",
  city: "Ville",
};