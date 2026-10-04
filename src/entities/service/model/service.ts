import { z } from "zod";
import { SERVICE_STATUSES, type ServiceStatus } from "./types";

export const serviceStatusSchema = z.enum(SERVICE_STATUSES);

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  available: "Opérationnel",
  maintenance: "En maintenance",
  incident: "Indisponible",
};

export const SERVICE_STATUS_OPTIONS = SERVICE_STATUSES.map((value) => ({
  value,
  label: SERVICE_STATUS_LABELS[value],
}));