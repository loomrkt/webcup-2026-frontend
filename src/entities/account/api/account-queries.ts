"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAccount,
  fetchAccount,
  restoreAccount,
  updateAccount,
} from "./account-api";
import type { DeleteAccountInput, UpdateAccountInput } from "../model/types";

export const accountQueryKeys = {
  all: ["accounts"] as const,
  detail: (id: string) => ["accounts", "detail", id] as const,
};

export function useAccountQuery(id: string) {
  return useQuery({
    queryKey: accountQueryKeys.detail(id),
    queryFn: () => fetchAccount(id),
    enabled: !!id,
  });
}

export function useUpdateAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAccountInput }) =>
      updateAccount(id, input),
    onSuccess: (account) => {
      void queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      void queryClient.setQueryData(accountQueryKeys.detail(account.id), account);
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: DeleteAccountInput }) =>
      deleteAccount(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      void queryClient.setQueryData(accountQueryKeys.detail(id), null);
    },
  });
}

export function useRestoreAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreAccount(id),
    onSuccess: (account) => {
      void queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      void queryClient.setQueryData(accountQueryKeys.detail(account.id), account);
    },
  });
}