import { axiosCredential } from "@/lib/axios";
import type { LoginInput } from "@/schemas/auth/login-schema";
import type { AuthApiEnvelope, LoginData } from "./types";

export const loginService = async (data: LoginInput): Promise<LoginData> => {
  const response = await axiosCredential.post<AuthApiEnvelope<LoginData>>(
    "/auth/login",
    { email: data.email, password: data.password },
  );
  return response.data.data;
};