import { z } from "zod";
import {
  requestPrioritySchema,
  requestStatusSchema,
} from "@/entities/request";

export const requestUpdateSchema = z.object({
  status: requestStatusSchema,
  priority: requestPrioritySchema,
  assignedToId: z.string().optional(),
  comment: z.string().max(500).optional(),
  adminNote: z.string().max(10_000).optional(),
});

export type RequestUpdateFormValues = z.infer<typeof requestUpdateSchema>;