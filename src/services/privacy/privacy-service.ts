import { axiosCredential } from "@/lib/axios";
import type { ApiResponse } from "@/interfaces/global";
import type { PrivacyExport } from "./types";

const unwrap = <T>(response: { data: ApiResponse<T> }): T =>
  response.data.data as T;

/** F55 — export structuré (RGPD) des données personnelles. */
export const fetchPrivacyExport = async (): Promise<PrivacyExport> =>
  axiosCredential.get<ApiResponse<PrivacyExport>>("/privacy/export").then(unwrap);

/** F56 — récapitulatif CSV des demandes du citoyen. */
export const downloadRequestsCsv = async (): Promise<Blob> =>
  axiosCredential
    .get<Blob>("/requests/me/summary/download", { responseType: "blob" })
    .then((response) => response.data);

/** F88 — récapitulatif CSV de toutes les demandes (agents). */
export const downloadAllRequestsCsv = async (): Promise<Blob> =>
  axiosCredential
    .get<Blob>("/requests/export/download", { responseType: "blob" })
    .then((response) => response.data);

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  triggerDownload(blob, filename);
}