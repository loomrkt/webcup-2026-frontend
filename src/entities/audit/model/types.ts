export interface AuditEvent {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
}

export interface AuditListParams {
  q?: string;
  entityType?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAudit {
  items: AuditEvent[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}