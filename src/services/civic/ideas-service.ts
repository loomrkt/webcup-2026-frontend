import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type { CitizenIdea, CreateIdeaInput } from "./types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

const unwrapPaginated = <T>(response: {
  data: ApiResponse<T[]> & { meta?: PaginationMeta };
}): PaginatedData<T> => ({
  items: response.data.data ?? [],
  meta: response.data.meta ?? {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 0,
  },
});

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

export const createIdea = async (input: CreateIdeaInput): Promise<CitizenIdea> =>
  axiosCredential
    .post<ApiResponse<CitizenIdea>>("/ideas", input)
    .then(unwrap);

export const fetchMyIdeas = async (limit = 100): Promise<PaginatedData<CitizenIdea>> =>
  axiosCredential
    .get<ApiResponse<CitizenIdea[]> & { meta?: PaginationMeta }>("/ideas/me", {
      params: { page: 1, limit },
    })
    .then(unwrapPaginated);