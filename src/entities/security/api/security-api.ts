import { axiosCredential } from "@/lib/axios";
import type {
  LockedAccount,
  PaginatedSecurityEvents,
  SecurityEvent,
  SecurityEventListParams,
} from "../model/types";

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

export const fetchLockedAccounts = async (): Promise<LockedAccount[]> =>
  axiosCredential
    .get<ApiEnvelope<LockedAccount[]>>("/security/locks")
    .then(unwrap);

export const fetchSecurityEvents = async (
  params: SecurityEventListParams = {},
): Promise<PaginatedSecurityEvents> => {
  const response = await axiosCredential.get<ApiEnvelope<SecurityEvent[]>>(
    "/security/events",
    { params },
  );
  const items = response.data.data;
  const meta = response.data.meta ?? {
    page: 1,
    limit: 50,
    total: items.length,
    totalPages: 1,
  };
  return { items, meta };
};