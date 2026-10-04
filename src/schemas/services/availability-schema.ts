import { z } from "zod";
import { SERVICE_STATUSES } from "@/services/services/types";

export const SERVICE_DISABLE_STATUSES = [
  "incident",
  "maintenance",
] as const;

export const disableServiceSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Le motif est obligatoire pour désactiver un service")
    .max(2000, "Le motif ne doit pas dépasser 2000 caractères"),
  status: z.enum(SERVICE_DISABLE_STATUSES).default("incident"),
});

export type DisableServiceFormInput = z.input<typeof disableServiceSchema>;
export type DisableServiceInput = z.infer<typeof disableServiceSchema>;

export const enableServiceSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(2000, "Le motif ne doit pas dépasser 2000 caractères")
    .optional()
    .or(z.literal("")),
});

export type EnableServiceInput = z.infer<typeof enableServiceSchema>;

export { SERVICE_STATUSES };