import { z } from "zod";
import { ANNOUNCEMENT_PRIORITIES } from "@/entities/announcement";

export const announcementCreateSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(10_000),
  priority: z.enum(ANNOUNCEMENT_PRIORITIES),
  zone: z.string().max(120).optional(),
  ctaLabel: z.string().max(120).optional(),
  ctaUrl: z.string().max(500).optional(),
  publish: z.boolean(),
});

export type AnnouncementCreateFormValues = z.infer<
  typeof announcementCreateSchema
>;