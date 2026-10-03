"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchRequest,
  fetchRequestIndicators,
  fetchRequests,
  updateRequest,
} from "./request-api";
import type { RequestListParams, RequestUpdateInput } from "../model/types";

export const requestsQueryKeys = {
  all: ["requests"] as const,
  list: (params: RequestListParams) =>
    ["requests", "list", params] as const,
  detail: (id: string) => ["requests", "detail", id] as const,
  indicators: ["requests", "indicators"] as const,
};

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