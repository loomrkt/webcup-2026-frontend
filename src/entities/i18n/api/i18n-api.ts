import { axiosCredential } from "@/lib/axios";
import type {
  ContentTranslations,
  ContentTranslationParams,
  UiStrings,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchUiStrings = async (locale: string): Promise<UiStrings> =>
  axiosCredential
    .get<ApiEnvelope<UiStrings>>(`/i18n/ui/${locale}`)
    .then(unwrap);

export const fetchContentTranslations = async (
  params: ContentTranslationParams,
): Promise<ContentTranslations> =>
  axiosCredential
    .get<ApiEnvelope<ContentTranslations>>("/i18n/translations", {
      params,
    })
    .then(unwrap);