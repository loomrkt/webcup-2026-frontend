import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope } from "./types";

export interface MeRole {
  id: string;
  name: string;
}

export interface MeData {
  id: string;
  email: string;
  emailVerified: boolean;
  totpActive: boolean;
  mfaEmailActive: boolean;
  roles: MeRole[];
  permissions: string[];
}

export const getMe = async (): Promise<MeData> => {
  const response = await axiosCredential.get<AuthApiEnvelope<MeData>>(
    "/auth/me",
  );
  return response.data.data;
};