import { axiosCredential } from "@/lib/axios";
import type { AccessibilityPreferences } from "@/interfaces/accessibility";
import type { AuthApiEnvelope } from "./types";

export interface UpdatePreferencesResponse {
  language: string;
  preferences: AccessibilityPreferences;
}

const unwrap = (response: {
  data: AuthApiEnvelope<UpdatePreferencesResponse>;
}): UpdatePreferencesResponse => response.data.data;

export const updatePreferences = async (
  patch: Partial<AccessibilityPreferences>,
): Promise<UpdatePreferencesResponse> =>
  axiosCredential
    .patch<AuthApiEnvelope<UpdatePreferencesResponse>>("/auth/me/preferences", patch)
    .then(unwrap);