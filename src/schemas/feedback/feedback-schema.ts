import { z } from "zod";
import { FEEDBACK_SENTIMENTS } from "@/services/civic/project-types";

export const feedbackFormSchema = z
  .object({
    sentiment: z
      .enum(FEEDBACK_SENTIMENTS)
      .nullable()
      .optional(),
    comment: z
      .string()
      .trim()
      .max(5000, "Le commentaire ne doit pas dépasser 5000 caractères")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (values) => !!values.sentiment || !!values.comment?.trim(),
    {
      path: ["sentiment"],
      message: "Donnez votre avis (choix ou commentaire).",
    },
  );

export type FeedbackFormInput = z.infer<typeof feedbackFormSchema>;

export const feedbackPayloadSchema = feedbackFormSchema.transform(
  ({ sentiment, comment }) => ({
    sentiment: sentiment ?? null,
    comment: comment?.trim() ? comment.trim() : null,
  }),
);

export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>;