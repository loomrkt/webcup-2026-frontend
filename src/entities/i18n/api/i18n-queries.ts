"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchContentTranslations, fetchUiStrings } from "./i18n-api";
import type { ContentTranslationParams } from "../model/types";

export const i18nQueryKeys = {
  all: ["i18n"] as const,
  ui: (locale: string) => ["i18n", "ui", locale] as const,
  translations: (params: ContentTranslationParams) =>
    ["i18n", "translations", params] as const,
};

export function useUiStringsQuery(locale: string) {
  return useQuery({
    queryKey: i18nQueryKeys.ui(locale),
    queryFn: () => fetchUiStrings(locale),
    enabled: !!locale,
  });
}

export function useContentTranslationsQuery(
  params: ContentTranslationParams,
) {
  return useQuery({
    queryKey: i18nQueryKeys.translations(params),
    queryFn: () => fetchContentTranslations(params),
    enabled: !!params.locale && !!params.entityType,
  });
}