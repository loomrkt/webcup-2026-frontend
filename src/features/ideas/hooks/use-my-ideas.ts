"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyIdeas } from "@/services/civic/ideas-service";

export function useMyIdeas() {
  return useQuery({
    queryKey: ["my-ideas"],
    queryFn: () => fetchMyIdeas(100),
    staleTime: 60_000,
  });
}