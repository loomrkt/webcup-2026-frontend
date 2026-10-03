import { axiosCredential } from "@/lib/axios";
import type { Service, ServiceSearchResult } from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchServices = async (locale?: string): Promise<Service[]> =>
  axiosCredential
    .get<ApiEnvelope<Service[]>>("/services", {
      params: { locale: locale || undefined },
    })
    .then(unwrap);

export const fetchFeaturedServices = async (
  locale?: string,
): Promise<Service[]> =>
  axiosCredential
    .get<ApiEnvelope<Service[]>>("/services/featured", {
      params: { locale: locale || undefined },
    })
    .then(unwrap);

export const searchServices = async (
  q: string,
  limit = 10,
  locale?: string,
): Promise<ServiceSearchResult> =>
  axiosCredential
    .get<ApiEnvelope<ServiceSearchResult>>("/services/search", {
      params: { q, limit, locale: locale || undefined },
    })
    .then(unwrap);

export const fetchService = async (
  id: string,
  locale?: string,
): Promise<Service> =>
  axiosCredential
    .get<ApiEnvelope<Service>>(`/services/${id}`, {
      params: { locale: locale || undefined },
    })
    .then(unwrap);