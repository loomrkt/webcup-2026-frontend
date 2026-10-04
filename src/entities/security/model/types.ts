export interface LockedAccount {
  id: string;
  email: string;
  lockedUntil: string | null;
  lastFailedAt: string | null;
}

export interface SecurityEvent {
  id: string;
  type: string;
  email: string | null;
  userId: string | null;
  ip: string | null;
  userAgent: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface SecurityEventListParams {
  email?: string;
  type?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSecurityEvents {
  items: SecurityEvent[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}