import { axiosCredential } from "@/lib/axios";
import type { DashboardStats, NovaTerraResponse } from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchDashboardStats = async (): Promise<DashboardStats> =>
  axiosCredential
    .get<ApiEnvelope<DashboardStats>>("/dashboard/stats")
    .then(unwrap);

export const fetchNovaTerraData = async (): Promise<NovaTerraResponse> =>
  axiosCredential
    .get<ApiEnvelope<NovaTerraResponse>>("/dashboard/nova-terra")
    .then(unwrap);