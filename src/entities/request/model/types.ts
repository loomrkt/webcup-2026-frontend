export const REQUEST_STATUSES = [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export const REQUEST_PRIORITIES = ["low", "normal", "high"] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export interface RequestUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface RequestService {
  id: string;
  name: string;
  slug?: string | null;
}

export interface RequestHistory {
  id: string;
  requestId: string;
  status: string;
  comment: string | null;
  createdById: string | null;
  createdBy?: RequestUser | null;
  request?: Request | null;
  createdAt: string;
}

export interface Request {
  id: string;
  ref: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  serviceId: string | null;
  service?: RequestService | null;
  status: RequestStatus;
  priority: RequestPriority;
  citizenId: string;
  citizen: RequestUser;
  assignedToId: string | null;
  assignedTo?: RequestUser | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  history?: RequestHistory[];
}

export interface RequestIndicators {
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  awaiting: number;
  unassigned: number;
  assignedToMe: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedRequests {
  items: Request[];
  meta: PaginationMeta;
}

export interface RequestListParams {
  status?: RequestStatus;
  priority?: RequestPriority;
  page?: number;
  limit?: number;
}

export interface RequestUpdateInput {
  status?: RequestStatus;
  priority?: RequestPriority;
  comment?: string | null;
  assignedToId?: string | null;
  adminNote?: string | null;
}