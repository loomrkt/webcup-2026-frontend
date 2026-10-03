import type {
  Request,
  RequestHistory,
  RequestStatus,
} from "@/entities/request";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  category: string | null;
  message: string;
  status: "new" | "read" | "answered";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeServices: number;
  publishedPublications: number;
  newContactMessages: number;
  totalRequests: number;
  requestsByStatus: Partial<Record<RequestStatus, number>>;
  requestsByDay: Array<{ day: string; count: number }>;
  recentRequests: Request[];
  recentActivity: RequestHistory[];
  latestContactMessages: ContactMessage[];
}

export interface NovaTerraResponse {
  source: "local" | "nova-terra";
  status: "unconfigured" | "ok" | "error";
  message?: string;
  data: unknown;
}