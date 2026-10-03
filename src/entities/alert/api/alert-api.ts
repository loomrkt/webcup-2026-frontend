import { axiosCredential } from "@/lib/axios";
import type {
  AiAlertDraft,
  AiGenerateInput,
  Alert,
  CreateAlertInput,
  UpdateAlertInput,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchActiveAlerts = async (
  zone?: string,
  light = false,
): Promise<Alert[]> =>
  axiosCredential
    .get<ApiEnvelope<Alert[]>>("/alerts/active", {
      params: { zone: zone || undefined, light: light || undefined },
    })
    .then(unwrap);

export const fetchAllAlerts = async (): Promise<Alert[]> =>
  axiosCredential.get<ApiEnvelope<Alert[]>>("/alerts/admin").then(unwrap);

export const fetchAlert = async (id: string): Promise<Alert> =>
  axiosCredential.get<ApiEnvelope<Alert>>(`/alerts/${id}`).then(unwrap);

export const createAlert = async (
  input: CreateAlertInput,
): Promise<Alert> =>
  axiosCredential.post<ApiEnvelope<Alert>>("/alerts", input).then(unwrap);

export const updateAlert = async (
  id: string,
  input: UpdateAlertInput,
): Promise<Alert> =>
  axiosCredential.patch<ApiEnvelope<Alert>>(`/alerts/${id}`, input).then(unwrap);

export const diffuseAlert = async (id: string): Promise<Alert> =>
  axiosCredential
    .post<ApiEnvelope<Alert>>(`/alerts/${id}/diffuse`)
    .then(unwrap);

export const deleteAlert = async (id: string): Promise<null> =>
  axiosCredential.delete<ApiEnvelope<null>>(`/alerts/${id}`).then(unwrap);

export const generateAlertDraft = async (
  input: AiGenerateInput,
): Promise<AiAlertDraft> =>
  axiosCredential
    .post<ApiEnvelope<AiAlertDraft>>("/alerts/ai/generate", input)
    .then(unwrap);