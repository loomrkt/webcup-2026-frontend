import { axiosCredential } from "@/lib/axios";
import type { LoginInput } from "@/schemas/auth/login-schema";

export interface LoginApiResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
  code: string;
  message: string;
  meta: null;
}

export const loginService = async (data: LoginInput) => {
  const response = await axiosCredential.post<LoginApiResponse>(
    "/auth/login",
    { email: data.email, password: data.password }
  );
  return response.data.data; // { id, email, accessToken, refreshToken }
};