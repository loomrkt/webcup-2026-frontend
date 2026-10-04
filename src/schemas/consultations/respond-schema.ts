import { z } from "zod";

/** Schéma dynamique : choice validé contre les choix de la consultation. */
export function respondSchema(choices: string[]) {
  return z.object({
    choice: z.enum(choices as [string, ...string[]], {
      message: "Choisissez une des options proposées.",
    }),
    comment: z
      .string()
      .trim()
      .max(5000, "Le commentaire ne doit pas dépasser 5000 caractères")
      .optional()
      .or(z.literal("")),
  });
}

export type RespondFormInput = z.infer<
  ReturnType<typeof respondSchema>
>;

export const respondPayloadSchema = (
  input: RespondFormInput,
): { choice: string; comment: string | null } => ({
  choice: input.choice,
  comment: input.comment?.trim() ? input.comment.trim() : null,
});