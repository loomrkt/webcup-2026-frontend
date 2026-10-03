import { z } from "zod";
import { requestPrioritySchema } from "@/entities/request";

export const createRequestSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(160, "Le titre est trop long."),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(10_000, "La description est trop longue."),
  category: z.string(),
  location: z.string().max(200, "Le lieu est trop long."),
  priority: requestPrioritySchema.or(z.literal("")),
  serviceId: z.string(),
});

export type CreateRequestFormValues = z.infer<typeof createRequestSchema>;

export const REQUEST_CATEGORIES = [
  { value: "", label: "Catégorie du problème" },
  { value: "voirie", label: "Voirie" },
  { value: "eclairage", label: "Éclairage public" },
  { value: "proprete", label: "Propreté" },
  { value: "espaces_verts", label: "Espaces verts" },
  { value: "transport", label: "Transport" },
  { value: "batiment", label: "Bâtiment public" },
  { value: "autre", label: "Autre" },
];