import { z } from "zod";
import {
  requestPrioritySchema,
  requestStatusSchema,
} from "@/entities/request";

export const filtersFormSchema = z.object({
  status: requestStatusSchema.or(z.literal("")),
  priority: requestPrioritySchema.or(z.literal("")),
});

export type FiltersFormValues = z.infer<typeof filtersFormSchema>;