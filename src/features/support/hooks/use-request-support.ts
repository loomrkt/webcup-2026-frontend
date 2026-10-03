"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSupportStatus,
  supportRequest,
  withdrawSupport,
} from "@/services/participation/support-service";

export const supportQueryKey = (requestId: string) => [
  "request-support",
  requestId,
];

export function useRequestSupport(requestId: string) {
  return useQuery({
    queryKey: supportQueryKey(requestId),
    queryFn: () => fetchSupportStatus(requestId),
    enabled: !!requestId,
    staleTime: 60_000,
  });
}

export function useToggleSupport(requestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supporting: boolean) =>
      supporting ? supportRequest(requestId) : withdrawSupport(requestId),
    onSuccess: (status) => {
      queryClient.setQueryData(supportQueryKey(requestId), status);
    },
  });
}