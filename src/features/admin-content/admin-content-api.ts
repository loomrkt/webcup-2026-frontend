import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

export interface ServiceFormValues {
  name: string;
  category?: string | null;
  description?: string | null;
  icon?: string | null;
  status?: string;
  active?: boolean;
  featured?: boolean;
}

export interface PublicationFormValues {
  title: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  published?: boolean;
}

export interface GlossaryTermFormValues {
  term: string;
  definition: string;
  category?: string | null;
  active?: boolean;
}

export interface MobilityLineFormValues {
  name: string;
  code: string;
  origin?: string | null;
  destination?: string | null;
  color?: string | null;
  info?: string | null;
  price?: string | null;
  frequency?: string | null;
  accessible?: boolean;
  active?: boolean;
}

export interface PlaceFormValues {
  name: string;
  category: string;
  address?: string | null;
  phone?: string | null;
  hours?: string | null;
  description?: string | null;
  emergency?: boolean;
  active?: boolean;
}

export interface ManagedPublication {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
}

export interface ManagedGlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
  order: number;
  active: boolean;
}

export interface ManagedMobilityLine {
  id: string;
  name: string;
  code: string;
  origin: string | null;
  destination: string | null;
  color: string | null;
  info: string | null;
  price: string | null;
  frequency: string | null;
  accessible: boolean;
  active: boolean;
}

export interface ManagedPlace {
  id: string;
  name: string;
  category: string;
  address: string | null;
  phone: string | null;
  hours: string | null;
  description: string | null;
  emergency: boolean;
  active: boolean;
}

export const createService = async (
  input: ServiceFormValues,
): Promise<unknown> =>
  axiosCredential.post<ApiResponse<unknown>>("/services", input).then(unwrap);

export const updateService = async (
  id: string,
  input: ServiceFormValues,
): Promise<unknown> =>
  axiosCredential
    .patch<ApiResponse<unknown>>(`/services/${id}`, input)
    .then(unwrap);

export const deleteService = async (id: string): Promise<unknown> =>
  axiosCredential
    .delete<ApiResponse<unknown>>(`/services/${id}`)
    .then(unwrap);

export const fetchAllPublications = async (): Promise<ManagedPublication[]> =>
  axiosCredential
    .get<ApiResponse<ManagedPublication[]>>("/news/admin/all")
    .then(unwrap);

export const createPublication = async (
  input: PublicationFormValues,
): Promise<unknown> =>
  axiosCredential.post<ApiResponse<unknown>>("/news", input).then(unwrap);

export const updatePublication = async (
  id: string,
  input: PublicationFormValues,
): Promise<unknown> =>
  axiosCredential
    .patch<ApiResponse<unknown>>(`/news/${id}`, input)
    .then(unwrap);

export const deletePublication = async (id: string): Promise<unknown> =>
  axiosCredential
    .delete<ApiResponse<unknown>>(`/news/${id}`)
    .then(unwrap);

export const fetchAllGlossaryTerms = async (): Promise<
  ManagedGlossaryTerm[]
> =>
  axiosCredential
    .get<ApiResponse<ManagedGlossaryTerm[]>>("/glossary/admin")
    .then(unwrap);

export const createGlossaryTerm = async (
  input: GlossaryTermFormValues,
): Promise<unknown> =>
  axiosCredential.post<ApiResponse<unknown>>("/glossary", input).then(unwrap);

export const updateGlossaryTerm = async (
  id: string,
  input: GlossaryTermFormValues,
): Promise<unknown> =>
  axiosCredential
    .patch<ApiResponse<unknown>>(`/glossary/${id}`, input)
    .then(unwrap);

export const deleteGlossaryTerm = async (id: string): Promise<unknown> =>
  axiosCredential
    .delete<ApiResponse<unknown>>(`/glossary/${id}`)
    .then(unwrap);

export const fetchAllMobilityLines = async (): Promise<
  ManagedMobilityLine[]
> =>
  axiosCredential
    .get<ApiResponse<ManagedMobilityLine[]>>("/mobility/admin/lines")
    .then(unwrap);

export const createMobilityLine = async (
  input: MobilityLineFormValues,
): Promise<unknown> =>
  axiosCredential
    .post<ApiResponse<unknown>>("/mobility/lines", input)
    .then(unwrap);

export const updateMobilityLine = async (
  id: string,
  input: MobilityLineFormValues,
): Promise<unknown> =>
  axiosCredential
    .patch<ApiResponse<unknown>>(`/mobility/lines/${id}`, input)
    .then(unwrap);

export const deleteMobilityLine = async (id: string): Promise<unknown> =>
  axiosCredential
    .delete<ApiResponse<unknown>>(`/mobility/lines/${id}`)
    .then(unwrap);

export const fetchAllPlaces = async (): Promise<ManagedPlace[]> =>
  axiosCredential
    .get<ApiResponse<ManagedPlace[]>>("/places/admin")
    .then(unwrap);

export const createPlace = async (
  input: PlaceFormValues,
): Promise<unknown> =>
  axiosCredential.post<ApiResponse<unknown>>("/places", input).then(unwrap);

export const updatePlace = async (
  id: string,
  input: PlaceFormValues,
): Promise<unknown> =>
  axiosCredential
    .patch<ApiResponse<unknown>>(`/places/${id}`, input)
    .then(unwrap);

export const deletePlace = async (id: string): Promise<unknown> =>
  axiosCredential
    .delete<ApiResponse<unknown>>(`/places/${id}`)
    .then(unwrap);