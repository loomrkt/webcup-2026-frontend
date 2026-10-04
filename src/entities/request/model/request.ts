import { z } from "zod";
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  type RequestPriority,
  type RequestStatus,
} from "./types";

export const requestStatusSchema = z.enum(REQUEST_STATUSES);
export const requestPrioritySchema = z.enum(REQUEST_PRIORITIES);

export const requestFiltersSchema = z.object({
  status: requestStatusSchema.or(z.literal("")).optional(),
  priority: requestPrioritySchema.or(z.literal("")).optional(),
});

export type RequestFilters = z.infer<typeof requestFiltersSchema>;

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Déposée",
  in_progress: "En cours",
  resolved: "Traitée",
  rejected: "Clôturée",
};

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
};

export const STATUS_OPTIONS = REQUEST_STATUSES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}));

export const PRIORITY_OPTIONS = REQUEST_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));