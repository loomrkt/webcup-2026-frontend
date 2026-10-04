import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type {
  Consultation,
  ConsultationResults,
  RespondInput,
  RespondResult,
} from "./consultation-types";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

/** F65 — consultations ouvertes (mode light en éco, F62). */
export const fetchConsultations = async (
  light = false,
): Promise<Consultation[]> =>
  axiosCredential
    .get<ApiResponse<Consultation[]>>("/consultations", {
      params: { light: light ? 1 : undefined },
    })
    .then(unwrap);

export const fetchConsultation = async (
  id: string,
): Promise<Consultation> =>
  axiosCredential
    .get<ApiResponse<Consultation>>(`/consultations/${id}`)
    .then(unwrap);

/** F65 — réponse à une consultation (upsert côté backend). */
export const respondConsultation = async (
  id: string,
  input: RespondInput,
): Promise<RespondResult> =>
  axiosCredential
    .post<ApiResponse<RespondResult>>(`/consultations/${id}/respond`, input)
    .then(unwrap);

/** F65 — résultats (403 si non publics et non-agent). */
export const fetchConsultationResults = async (
  id: string,
): Promise<ConsultationResults> =>
  axiosCredential
    .get<ApiResponse<ConsultationResults>>(`/consultations/${id}/results`)
    .then(unwrap);