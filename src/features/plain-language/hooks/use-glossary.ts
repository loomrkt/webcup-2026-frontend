"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGlossary } from "@/services/glossary/glossary-service";

export function useGlossary(q?: string) {
  return useQuery({
    queryKey: ["glossary", q ?? ""],
    queryFn: () =>
      fetchGlossary({
        ...(q ? { q, limit: 200 } : { limit: 200 }),
      }),
    staleTime: 5 * 60 * 1000,
  });
}