"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createRequest,
  fetchMyRequestHistory,
  fetchMyRequests,
  fetchRequest,
  fetchRequestIndicators,
  fetchRequests,
  updateRequest,
} from "./request-api";
import type {
  CreateRequestInput,
  RequestListParams,
  RequestUpdateInput,
} from "../model/types";

export const requestsQueryKeys = {
  all: ["requests"] as const,
  list: (params: RequestListParams) =>
    ["requests", "list", params] as const,
  mine: (params: RequestListParams) =>
    ["requests", "mine", params] as const,
  history: (params: RequestListParams) =>
    ["requests", "mine", "history", params] as const,
  detail: (id: string) => ["requests", "detail", id] as const,
  indicators: ["requests", "indicators"] as const,
};

export function useMyRequestsQuery(params: RequestListParams) {
  return useQuery({
    queryKey: requestsQueryKeys.mine(params),
    queryFn: () => fetchMyRequests(params),
    placeholderData: keepPreviousData,
  });
}

export function useMyRequestHistoryQuery(params: RequestListParams) {
  return useQuery({
    queryKey: requestsQueryKeys.history(params),
    queryFn: () => fetchMyRequestHistory(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRequestInput) => createRequest(input),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({
        queryKey: requestsQueryKeys.all,
      });
      return created;
    },
  });
}

export function useRequestsQuery(params: RequestListParams) {
  return useQuery({
    queryKey: requestsQueryKeys.list(params),
    queryFn: () => fetchRequests(params),
    placeholderData: keepPreviousData,
  });
}

export function useRequestQuery(id: string) {
  return useQuery({
    queryKey: requestsQueryKeys.detail(id),
    queryFn: () => fetchRequest(id),
    enabled: !!id,
  });
}

export function useUpdateRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RequestUpdateInput }) =>
      updateRequest(id, input),
    onSuccess: (updated, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: requestsQueryKeys.all,
      });
      void queryClient.setQueryData(requestsQueryKeys.detail(id), updated);
    },
  });
}

export function useRequestIndicatorsQuery() {
  return useQuery({
    queryKey: requestsQueryKeys.indicators,
    queryFn: fetchRequestIndicators,
  });
}