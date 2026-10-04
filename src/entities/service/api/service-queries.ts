"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLanguageStore } from "@/features/language-selector";
import {
  fetchFeaturedServices,
  fetchService,
  fetchServices,
  searchServices,
} from "./service-api";

export const serviceQueryKeys = {
  all: ["services"] as const,
  list: (locale: string) => ["services", "list", locale] as const,
  featured: (locale: string) => ["services", "featured", locale] as const,
  search: (q: string, locale: string) =>
    ["services", "search", q, locale] as const,
  detail: (id: string, locale: string) =>
    ["services", "detail", id, locale] as const,
};

export function useServicesQuery() {
  const locale = useLanguageStore((s) => s.locale);
  return useQuery({
    queryKey: serviceQueryKeys.list(locale),
    queryFn: () => fetchServices(locale),
  });
}

export function useFeaturedServicesQuery() {
  const locale = useLanguageStore((s) => s.locale);
  return useQuery({
    queryKey: serviceQueryKeys.featured(locale),
    queryFn: () => fetchFeaturedServices(locale),
  });
}

export function useServiceSearchQuery(q: string) {
  const locale = useLanguageStore((s) => s.locale);
  const trimmed = q.trim();
  return useQuery({
    queryKey: serviceQueryKeys.search(trimmed, locale),
    queryFn: () => searchServices(trimmed, 10, locale),
    enabled: trimmed.length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useServiceQuery(id: string) {
  const locale = useLanguageStore((s) => s.locale);
  return useQuery({
    queryKey: serviceQueryKeys.detail(id, locale),
    queryFn: () => fetchService(id, locale),
    enabled: !!id,
  });
}