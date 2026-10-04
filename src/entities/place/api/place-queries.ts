"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchEmergencyPlaces, fetchPlace, fetchPlaces } from "./place-api";
import type { PlaceListParams } from "../model/types";

export const placeQueryKeys = {
  all: ["places"] as const,
  list: (params: PlaceListParams) =>
    [
      "places",
      "list",
      params.q ?? "",
      params.category ?? "",
      params.emergency ?? "",
    ] as const,
  emergency: ["places", "emergency"] as const,
  detail: (id: string) => ["places", "detail", id] as const,
};

export function usePlacesQuery(params: PlaceListParams = {}) {
  return useQuery({
    queryKey: placeQueryKeys.list(params),
    queryFn: () => fetchPlaces(params),
    placeholderData: keepPreviousData,
  });
}

export function useEmergencyPlacesQuery() {
  return useQuery({
    queryKey: placeQueryKeys.emergency,
    queryFn: fetchEmergencyPlaces,
  });
}

export function usePlaceQuery(id: string) {
  return useQuery({
    queryKey: placeQueryKeys.detail(id),
    queryFn: () => fetchPlace(id),
    enabled: !!id,
  });
}