import { axiosCredential } from "@/lib/axios";
import type { Place, PlaceListParams } from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchPlaces = async (
  params: PlaceListParams = {},
): Promise<Place[]> =>
  axiosCredential
    .get<ApiEnvelope<Place[]>>("/places", {
      params: {
        q: params.q || undefined,
        category: params.category || undefined,
        ...(params.emergency === undefined
          ? {}
          : { emergency: String(params.emergency) }),
        limit: params.limit || undefined,
      },
    })
    .then(unwrap);

export const fetchEmergencyPlaces = async (): Promise<Place[]> =>
  axiosCredential.get<ApiEnvelope<Place[]>>("/places/emergency").then(unwrap);

export const fetchPlace = async (id: string): Promise<Place> =>
  axiosCredential.get<ApiEnvelope<Place>>(`/places/${id}`).then(unwrap);