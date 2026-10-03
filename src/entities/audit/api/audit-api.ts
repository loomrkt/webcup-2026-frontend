import { axiosCredential } from "@/lib/axios";
import type { AuditEvent, AuditListParams, PaginatedAudit } from "../model/types";

interface ApiEnvelope<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

const DEFAULT_META = { page: 1, limit: 50, total: 0, totalPages: 1 };

export const fetchAudit = async (
  params: AuditListParams = {},
): Promise<PaginatedAudit> => {
  const response = await axiosCredential.get<ApiEnvelope<AuditEvent[]>>(
    "/audit",
    { params },
  );
  const items = response.data.data;
  const meta = response.data.meta ?? {
    ...DEFAULT_META,
    total: items.length,
  };
  return { items, meta };
};

export const fetchAuditEntityTypes = async (): Promise<string[]> =>
  axiosCredential
    .get<ApiEnvelope<string[]>>("/audit/entity-types")
    .then(unwrap);