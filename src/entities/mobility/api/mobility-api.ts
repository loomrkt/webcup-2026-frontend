import { axiosCredential } from "@/lib/axios";
import type {
  MobilityLineDetail,
  MobilityLinesResult,
  MobilityListParams,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchMobilityLines = async (
  params: MobilityListParams = {},
): Promise<MobilityLinesResult> =>
  axiosCredential
    .get<ApiEnvelope<MobilityLinesResult>>("/mobility/lines", {
      params: { q: params.q || undefined, day: params.day || undefined },
    })
    .then(unwrap);

export const fetchMobilityLine = async (
  id: string,
  day?: string,
): Promise<MobilityLineDetail> =>
  axiosCredential
    .get<ApiEnvelope<MobilityLineDetail>>(`/mobility/lines/${id}`, {
      params: { day: day || undefined },
    })
    .then(unwrap);