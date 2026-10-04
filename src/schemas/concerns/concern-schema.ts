import { z } from "zod";

export const concernFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères")
    .max(10_000, "Votre message ne doit pas dépasser 10 000 caractères"),
  category: z
    .string()
    .trim()
    .max(120, "La catégorie ne doit pas dépasser 120 caractères")
    .optional()
    .or(z.literal("")),
});

export type ConcernFormInput = z.infer<typeof concernFormSchema>;

export const concernPayloadSchema = concernFormSchema.transform(
  ({ category, ...rest }) => ({
    ...rest,
    category: category?.trim() ? category.trim() : null,
  }),
);

export type ConcernPayload = z.infer<typeof concernPayloadSchema>;

export const requestIdSchema = z
  .string()
  .trim()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Identifiant de demande invalide.",
  );