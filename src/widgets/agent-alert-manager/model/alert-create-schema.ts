import { z } from "zod";
import { ALERT_CRITICALITIES } from "@/entities/alert";

export const alertCriticalitySchema = z.enum(ALERT_CRITICALITIES);

export const alertCreateSchema = z.object({
  title: z.string().min(3).max(200),
  message: z.string().min(10).max(10_000),
  criticality: alertCriticalitySchema,
  zone: z.string().max(120).optional(),
  recommendationsText: z.string().max(4000).optional(),
  vulnerableRecommendationsText: z.string().max(4000).optional(),
  publish: z.boolean(),
});

export type AlertCreateFormValues = z.infer<typeof alertCreateSchema>;

export const aiGenerateSchema = z.object({
  situation: z.string().min(10).max(10_000),
  zone: z.string().max(120).optional(),
});

export type AiGenerateFormValues = z.infer<typeof aiGenerateSchema>;

export function splitLines(value?: string): string[] | null {
  if (!value) return null;
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : null;
}