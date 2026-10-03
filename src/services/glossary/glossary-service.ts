import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type { GlossaryQuery, GlossaryTerm } from "./types";

const unwrap = (response: { data: ApiResponse<GlossaryTerm[]> }): GlossaryTerm[] =>
  response.data.data;

export const fetchGlossary = async (
  query: GlossaryQuery = {},
): Promise<GlossaryTerm[]> =>
  axiosCredential
    .get<ApiResponse<GlossaryTerm[]>>("/glossary", {
      params: {
        ...(query.q ? { q: query.q } : {}),
        ...(query.limit ? { limit: query.limit } : {}),
      },
    })
    .then(unwrap);