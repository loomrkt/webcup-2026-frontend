import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type {
  Service,
  ServiceStatusHistoryEntry,
  ServiceStatusSummary,
  SetAvailabilityInput,
} from "./types";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

/** F38 — liste publique des services (mode light = champs réduits, F62). */
export const fetchServices = async (light = false): Promise<Service[]> =>
  axiosCredential
    .get<ApiResponse<Service[]>>("/services", { params: { light: light ? 1 : undefined } })
    .then(unwrap);

/** F38 — vue d'ensemble de l'état des services (Service Status Center). */
export const fetchServiceStatus = async (): Promise<ServiceStatusSummary> =>
  axiosCredential.get<ApiResponse<ServiceStatusSummary>>("/services/status").then(unwrap);

/** F39 — liste complète (admin). */
export const fetchAdminServices = async (): Promise<Service[]> =>
  axiosCredential.get<ApiResponse<Service[]>>("/services/admin/all").then(unwrap);

/** F39 — activation/désactivation d'un service avec motif. */
export const setServiceAvailability = async (
  id: string,
  input: SetAvailabilityInput,
): Promise<Service> =>
  axiosCredential
    .post<ApiResponse<Service>>(`/services/${id}/availability`, input)
    .then(unwrap);

/** F39 — historique des changements d'état d'un service. */
export const fetchServiceStatusHistory = async (
  id: string,
): Promise<ServiceStatusHistoryEntry[]> =>
  axiosCredential
    .get<ApiResponse<ServiceStatusHistoryEntry[]>>(`/services/${id}/status-history`)
    .then(unwrap);