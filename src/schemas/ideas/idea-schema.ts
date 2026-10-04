import { z } from "zod";

export const ideaFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(160, "Le titre ne doit pas dépasser 160 caractères"),
  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(10_000, "La description ne doit pas dépasser 10 000 caractères"),
  category: z
    .string()
    .trim()
    .max(80, "La catégorie ne doit pas dépasser 80 caractères")
    .optional()
    .or(z.literal("")),
});

export type IdeaFormInput = z.infer<typeof ideaFormSchema>;

export const ideaPayloadSchema = ideaFormSchema.transform(({ category, ...rest }) => ({
  ...rest,
  category: category?.trim() ? category.trim() : null,
}));

export type IdeaPayload = z.infer<typeof ideaPayloadSchema>;