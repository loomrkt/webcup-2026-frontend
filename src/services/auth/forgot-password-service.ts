import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope } from "./types";

export interface ForgotPasswordInput {
  email: string;
}

export const forgotPasswordService = async (
  data: ForgotPasswordInput,
): Promise<null> => {
  const response = await axiosCredential.post<AuthApiEnvelope<null>>(
    "/auth/forgot-password",
    { email: data.email },
  );
  return response.data.data;
};