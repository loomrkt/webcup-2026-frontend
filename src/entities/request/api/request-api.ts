import { axiosCredential } from "@/lib/axios";
import type {
  CreateRequestInput,
  PaginatedRequestHistory,
  PaginatedRequests,
  Request,
  RequestHistory,
  RequestIndicators,
  RequestListParams,
  RequestUpdateInput,
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

const DEFAULT_META = { page: 1, limit: 20, total: 0, totalPages: 1 };

export const createRequest = async (
  input: CreateRequestInput,
): Promise<Request> =>
  axiosCredential.post<ApiEnvelope<Request>>("/requests", input).then(unwrap);

export const fetchMyRequests = async (
  params: RequestListParams = {},
): Promise<PaginatedRequests> => {
  const response = await axiosCredential.get<ApiEnvelope<Request[]>>(
    "/requests/me",
    { params },
  );
  const items = response.data.data;
  const meta = response.data.meta ?? {
    ...DEFAULT_META,
    total: items.length,
  };
  return { items, meta };
};

export const fetchMyRequestHistory = async (
  params: RequestListParams = {},
): Promise<PaginatedRequestHistory> => {
  const response = await axiosCredential.get<ApiEnvelope<RequestHistory[]>>(
    "/requests/me/history",
    { params },
  );
  const items = response.data.data;
  const meta = response.data.meta ?? {
    ...DEFAULT_META,
    total: items.length,
  };
  return { items, meta };
};

export const fetchRequests = async (
  params: RequestListParams = {},
): Promise<PaginatedRequests> => {
  const response = await axiosCredential.get<ApiEnvelope<Request[]>>(
    "/requests",
    { params },
  );
  const items = response.data.data;
  const meta = response.data.meta ?? {
    ...DEFAULT_META,
    total: items.length,
  };
  return { items, meta };
};

export const fetchRequest = async (id: string): Promise<Request> =>
  axiosCredential.get<ApiEnvelope<Request>>(`/requests/${id}`).then(unwrap);

export const updateRequest = async (
  id: string,
  input: RequestUpdateInput,
): Promise<Request> =>
  axiosCredential
    .patch<ApiEnvelope<Request>>(`/requests/${id}`, input)
    .then(unwrap);

export const fetchRequestIndicators = async (): Promise<RequestIndicators> =>
  axiosCredential
    .get<ApiEnvelope<RequestIndicators>>("/requests/indicators")
    .then(unwrap);