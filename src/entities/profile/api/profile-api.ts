import { axiosCredential } from "@/lib/axios";
import type {
  Profile,
  ProfileCompletion,
  UpdateProfileInput,
} from "../model/types";

interface ApiEnvelope<T> {
  data: T;
}

const unwrap = <T>(response: { data: ApiEnvelope<T> }): T => response.data.data;

export const fetchProfile = async (): Promise<Profile> =>
  axiosCredential.get<ApiEnvelope<Profile>>("/auth/me").then(unwrap);

export const updateProfile = async (
  input: UpdateProfileInput,
): Promise<Pick<Profile, "id" | "email" | "profile">> =>
  axiosCredential
    .patch<ApiEnvelope<Pick<Profile, "id" | "email" | "profile">>>(
      "/auth/me",
      input,
    )
    .then(unwrap);

export const fetchProfileCompletion =
  async (): Promise<ProfileCompletion> =>
    axiosCredential
      .get<ApiEnvelope<ProfileCompletion>>("/auth/me/profile-completion")
      .then(unwrap);

export interface LanguageUpdateResult {
  language: string;
  preferences: Record<string, unknown>;
}

export const updateLanguage = async (
  language: string,
): Promise<LanguageUpdateResult> =>
  axiosCredential
    .patch<ApiEnvelope<LanguageUpdateResult>>("/auth/me/preferences", {
      language,
    })
    .then(unwrap);