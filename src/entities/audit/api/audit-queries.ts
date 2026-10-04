"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAudit, fetchAuditEntityTypes } from "./audit-api";
import type { AuditListParams } from "../model/types";

export const auditQueryKeys = {
  all: ["audit"] as const,
  list: (params: AuditListParams) => ["audit", "list", params] as const,
  entityTypes: ["audit", "entity-types"] as const,
};

export function useAuditQuery(params: AuditListParams) {
  return useQuery({
    queryKey: auditQueryKeys.list(params),
    queryFn: () => fetchAudit(params),
    placeholderData: keepPreviousData,
  });
}

export function useAuditEntityTypesQuery() {
  return useQuery({
    queryKey: auditQueryKeys.entityTypes,
    queryFn: fetchAuditEntityTypes,
  });
}