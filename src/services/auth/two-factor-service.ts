import { axiosCredential } from "@/lib/axios";
import type { AuthApiEnvelope, LoginData } from "./types";

export interface TwoFactorSetupResult {
  secret: string;
  qrDataUrl: string;
}

export interface TwoFactorActivateResult {
  recoveryCodes: string[];
}

export interface EmailMfaSendResult {
  sent: boolean;
  expiresInSec: number;
}

export const verifyTwoFactorService = async (
  pendingToken: string,
  code: string,
): Promise<LoginData> => {
  const response = await axiosCredential.post<AuthApiEnvelope<LoginData>>(
    "/auth/2fa/verify",
    { pendingToken, code },
  );
  return response.data.data;
};

export const verifyRecoveryCodeService = async (
  pendingToken: string,
  code: string,
): Promise<LoginData> => {
  const response = await axiosCredential.post<AuthApiEnvelope<LoginData>>(
    "/auth/2fa/recovery",
    { pendingToken, code },
  );
  return response.data.data;
};

export const sendEmailMfaCodeService = async (
  pendingToken: string,
): Promise<EmailMfaSendResult> => {
  const response = await axiosCredential.post<AuthApiEnvelope<EmailMfaSendResult>>(
    "/auth/2fa/email/send-code",
    { pendingToken },
  );
  return response.data.data;
};

export const setupTwoFactorService = async (): Promise<TwoFactorSetupResult> => {
  const response = await axiosCredential.post<AuthApiEnvelope<TwoFactorSetupResult>>(
    "/auth/2fa/setup",
  );
  return response.data.data;
};

export const activateTwoFactorService = async (
  code: string,
): Promise<TwoFactorActivateResult> => {
  const response = await axiosCredential.post<AuthApiEnvelope<TwoFactorActivateResult>>(
    "/auth/2fa/activate",
    { code },
  );
  return response.data.data;
};

export const deactivateTwoFactorService = async (code: string): Promise<void> => {
  await axiosCredential.post<AuthApiEnvelope<null>>("/auth/2fa/deactivate", {
    code,
  });
};

export const enableEmailMfaService = async (): Promise<{
  mfaEmailActive: boolean;
}> => {
  const response = await axiosCredential.post<AuthApiEnvelope<{ mfaEmailActive: boolean }>>(
    "/auth/2fa/email/enable",
  );
  return response.data.data;
};

export const disableEmailMfaService = async (code: string): Promise<{
  mfaEmailActive: boolean;
}> => {
  const response = await axiosCredential.post<AuthApiEnvelope<{ mfaEmailActive: boolean }>>(
    "/auth/2fa/email/disable",
    { code },
  );
  return response.data.data;
};