import { axiosCredential } from "@/lib/axios";
import type { Publication } from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchPublications = async (): Promise<Publication[]> =>
  axiosCredential.get<ApiEnvelope<Publication[]>>("/news").then(unwrap);

export const fetchPublication = async (id: string): Promise<Publication> =>
  axiosCredential.get<ApiEnvelope<Publication>>(`/news/${id}`).then(unwrap);