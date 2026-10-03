import { z } from "zod";

export const auditFiltersSchema = z.object({
  q: z.string().max(160).optional(),
  entityType: z.string().max(60).optional(),
  action: z.string().max(40).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type AuditFiltersFormValues = z.infer<typeof auditFiltersSchema>;