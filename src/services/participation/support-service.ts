import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type { SupportStatus } from "./types";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

export const fetchSupportStatus = async (
  requestId: string,
): Promise<SupportStatus> =>
  axiosCredential
    .get<ApiResponse<SupportStatus>>(`/requests/${requestId}/support`)
    .then(unwrap);

export const supportRequest = async (
  requestId: string,
): Promise<SupportStatus> =>
  axiosCredential
    .post<ApiResponse<SupportStatus>>(`/requests/${requestId}/support`)
    .then(unwrap);

export const withdrawSupport = async (
  requestId: string,
): Promise<SupportStatus> =>
  axiosCredential
    .delete<ApiResponse<SupportStatus>>(`/requests/${requestId}/support`)
    .then(unwrap);