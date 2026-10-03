import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope } from "./types";

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export const resetPasswordService = async (
  data: ResetPasswordInput,
): Promise<null> => {
  const response = await axiosCredential.post<AuthApiEnvelope<null>>(
    "/auth/reset-password",
    { token: data.token, password: data.password },
  );
  return response.data.data;
};