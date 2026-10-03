import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope, LoginData } from "./types";

export const passwordlessRequestService = async (email: string): Promise<void> => {
  await axiosCredential.post<AuthApiEnvelope<null>>("/auth/passwordless/request", {
    email,
  });
};

export const passwordlessVerifyService = async (
  email: string,
  code: string,
): Promise<LoginData> => {
  const response = await axiosCredential.post<AuthApiEnvelope<LoginData>>(
    "/auth/passwordless/verify",
    { email, code },
  );
  return response.data.data;
};