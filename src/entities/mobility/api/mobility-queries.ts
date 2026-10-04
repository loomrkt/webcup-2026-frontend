"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMobilityLine, fetchMobilityLines } from "./mobility-api";
import type { MobilityListParams } from "../model/types";

export const mobilityQueryKeys = {
  all: ["mobility"] as const,
  lines: (params: MobilityListParams) =>
    ["mobility", "lines", params.q ?? "", params.day ?? ""] as const,
  detail: (id: string, day: string) =>
    ["mobility", "lines", id, day] as const,
};

export function useMobilityLinesQuery(params: MobilityListParams = {}) {
  return useQuery({
    queryKey: mobilityQueryKeys.lines(params),
    queryFn: () => fetchMobilityLines(params),
    placeholderData: keepPreviousData,
  });
}

export function useMobilityLineQuery(id: string, day?: string) {
  return useQuery({
    queryKey: mobilityQueryKeys.detail(id, day ?? ""),
    queryFn: () => fetchMobilityLine(id, day),
    enabled: !!id,
  });
}