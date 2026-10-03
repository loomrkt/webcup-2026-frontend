export const SERVICE_STATUSES = [
  "available",
  "maintenance",
  "incident",
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export type AvailabilityCode = "operational" | "degraded" | "unavailable";

export interface ServiceAvailability {
  code: AvailabilityCode;
  label: string;
  nextAction: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  featured: boolean;
  featuredOrder: number;
  status: ServiceStatus;
  statusMessage: string | null;
  resumeAt: string | null;
  alternativeServiceId: string | null;
  alternativeService: Service | null;
  availability?: ServiceAvailability;
  translations?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceStatusSummary {
  healthy: number;
  maintenance: Service[];
  incident: Service[];
}

export interface ServiceStatusHistoryEntry {
  id: string;
  serviceId: string;
  active: boolean;
  status: string;
  reason: string | null;
  changedById: string | null;
  changedBy?: { id: string; email: string } | null;
  createdAt: string;
}

export interface SetAvailabilityInput {
  available: boolean;
  status?: ServiceStatus;
  reason?: string | null;
}