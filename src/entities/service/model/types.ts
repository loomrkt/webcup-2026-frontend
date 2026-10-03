export const SERVICE_STATUSES = [
  "available",
  "maintenance",
  "incident",
] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

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
  /** Disponibilité du service : disponible / maintenance / incident (F38). */
  status: ServiceStatus;
  statusMessage: string | null;
  resumeAt: string | null;
  alternativeServiceId: string | null;
  alternativeService?: Service | null;
  createdAt: string;
  updatedAt: string;
  translations?: Record<string, string>;
}

export interface ServiceSearchResult {
  items: Service[];
  attention: unknown[];
}

export interface ServiceSearchParams {
  q?: string;
  limit?: number;
}