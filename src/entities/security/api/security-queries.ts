"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLockedAccounts, fetchSecurityEvents } from "./security-api";
import type { SecurityEventListParams } from "../model/types";

export const securityQueryKeys = {
  all: ["security"] as const,
  locks: ["security", "locks"] as const,
  events: (params: SecurityEventListParams) =>
    ["security", "events", params] as const,
};

export function useLockedAccountsQuery() {
  return useQuery({
    queryKey: securityQueryKeys.locks,
    queryFn: fetchLockedAccounts,
  });
}

export function useSecurityEventsQuery(params: SecurityEventListParams) {
  return useQuery({
    queryKey: securityQueryKeys.events(params),
    queryFn: () => fetchSecurityEvents(params),
  });
}