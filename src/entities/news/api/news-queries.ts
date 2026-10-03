"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPublication, fetchPublications } from "./news-api";

export const newsQueryKeys = {
  all: ["news"] as const,
  list: ["news", "list"] as const,
  detail: (id: string) => ["news", "detail", id] as const,
};

export function usePublicationsQuery() {
  return useQuery({
    queryKey: newsQueryKeys.list,
    queryFn: fetchPublications,
  });
}

export function usePublicationQuery(id: string) {
  return useQuery({
    queryKey: newsQueryKeys.detail(id),
    queryFn: () => fetchPublication(id),
    enabled: !!id,
  });
}