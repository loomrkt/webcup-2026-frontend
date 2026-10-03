import { axiosCredential } from "@/lib/axios";
import type {
  GuideForUser,
  GuideProgress,
  GuideStep,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchGuides = async (): Promise<GuideStep[]> =>
  axiosCredential.get<ApiEnvelope<GuideStep[]>>("/guides").then(unwrap);

export const fetchMyGuides = async (): Promise<GuideForUser> =>
  axiosCredential.get<ApiEnvelope<GuideForUser>>("/guides/me").then(unwrap);

export const completeGuide = async (key: string): Promise<GuideProgress> =>
  axiosCredential
    .post<ApiEnvelope<GuideProgress>>(`/guides/${key}/complete`)
    .then(unwrap);

export const dismissGuide = async (key: string): Promise<GuideProgress> =>
  axiosCredential
    .post<ApiEnvelope<GuideProgress>>(`/guides/${key}/dismiss`)
    .then(unwrap);