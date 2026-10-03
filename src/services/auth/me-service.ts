import { axiosCredential } from "@/lib/axios";
import type { AccessibilityPreferences } from "@/interfaces/accessibility";
import type { AuthApiEnvelope } from "./types";

export interface MeRole {
  id: string;
  name: string;
}

export interface MeData {
  id: string;
  email: string;
  emailVerified: boolean;
  roles: MeRole[];
  permissions: string[];
  language?: string;
  preferences?: Partial<AccessibilityPreferences>;
}

export const getMe = async (): Promise<MeData> => {
  const response = await axiosCredential.get<AuthApiEnvelope<MeData>>(
    "/auth/me",
  );
  return response.data.data;
};