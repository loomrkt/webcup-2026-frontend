import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type { CreateConcernInput, DataConcern } from "./types";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

export const submitConcern = async (
  input: CreateConcernInput,
): Promise<DataConcern> =>
  axiosCredential
    .post<ApiResponse<DataConcern>>("/participation/concerns", input)
    .then(unwrap);

export const fetchMyConcerns = async (
  limit = 100,
): Promise<DataConcern[]> =>
  axiosCredential
    .get<ApiResponse<DataConcern[]>>("/participation/concerns/me", {
      params: { page: 1, limit },
    })
    .then((response) => response.data.data ?? []);