"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyConcerns } from "@/services/participation/concerns-service";

export function useMyConcerns() {
  return useQuery({
    queryKey: ["my-concerns"],
    queryFn: () => fetchMyConcerns(100),
    staleTime: 60_000,
  });
}