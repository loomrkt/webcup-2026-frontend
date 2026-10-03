import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope } from "./types";

export interface VerifyEmailInput {
  token: string;
}

export interface ResendVerificationInput {
  email: string;
}

export const verifyEmailService = async (
  data: VerifyEmailInput,
): Promise<null> => {
  const response = await axiosCredential.post<AuthApiEnvelope<null>>(
    "/auth/verify-email",
    { token: data.token },
  );
  return response.data.data;
};

export const resendVerificationService = async (
  data: ResendVerificationInput,
): Promise<null> => {
  const response = await axiosCredential.post<AuthApiEnvelope<null>>(
    "/auth/resend-verification",
    { email: data.email },
  );
  return response.data.data;
};