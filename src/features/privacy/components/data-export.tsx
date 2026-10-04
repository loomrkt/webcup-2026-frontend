"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleAlert,
  Database,
  Download,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { getApiErrorMessage } from "@/services/common/error-message";
import {
  downloadJson,
  downloadRequestsCsv,
  fetchPrivacyExport,
  triggerDownload,
} from "@/services/privacy/privacy-service";
import type { PrivacyExport } from "@/services/privacy/types";

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

const SECTION_LABELS: { key: keyof PrivacyExport; label: string }[] = [
  { key: "requests", label: "Demandes déposées" },
  { key: "requestHistory", label: "Historique des demandes" },
  { key: "supports", label: "Soutiens apportés" },
  { key: "dataConcerns", label: "Préoccupations données" },
  { key: "appointments", label: "Rendez-vous" },
  { key: "notifications", label: "Notifications" },
  { key: "securityEvents", label: "Événements de sécurité" },
  { key: "sessions", label: "Sessions actives / passées" },
];

function ExportSummary({ data }: { data: PrivacyExport }) {
  const { profile } = data;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[var(--dg-text-muted)]">
        Export généré le{" "}
        <strong className="text-[var(--dg-text)]">
          {new Date(data.exportedAt).toLocaleString("fr-FR")}
        </strong>{" "}
        — fichier JSON téléchargé contenant les sections suivantes :
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {SECTION_LABELS.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-3 py-2"
          >
            <span className="text-xs text-[var(--dg-text-muted)]">{label}</span>
            <strong className="font-mono text-sm text-[var(--dg-accent-bright)]">
              {Array.isArray(data[key]) ? data[key].length : 0}
            </strong>
          </div>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[var(--dg-text-faint)]">
        Profil inclus : {profile.email}
        {profile.firstName || profile.lastName
          ? ` (${[profile.firstName, profile.lastName].filter(Boolean).join(" ")})`
          : ""}
        {profile.city ? ` — ${profile.city}` : ""} · compte{" "}
        {profile.accountStatus} · 2FA{" "}
        {profile.twoFactorEnabled ? "activé" : "désactivé"}.
      </p>
    </div>
  );
}

export function DataExport() {
  const [lastExport, setLastExport] = useState<PrivacyExport | null>(null);
  const [jsonStatus, setJsonStatus] = useState<
    "idle" | "running" | "done" | "error"
  >("idle");
  const [csvStatus, setCsvStatus] = useState<
    "idle" | "running" | "done" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const exportJson = useMutation({
    mutationFn: async () => {
      const data = await fetchPrivacyExport();
      downloadJson(data, `mes-donnees-terranova-${todayStamp()}.json`);
      return data;
    },
    onMutate: () => {
      setJsonStatus("running");
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      setLastExport(data);
      setJsonStatus("done");
    },
    onError: (error: unknown) => {
      setJsonStatus("error");
      setErrorMessage(
        getApiErrorMessage(error, "Impossible de générer l'export."),
      );
    },
  });

  const exportCsv = useMutation({
    mutationFn: async () => {
      const blob = await downloadRequestsCsv();
      triggerDownload(blob, `mes-demandes-${todayStamp()}.csv`);
    },
    onMutate: () => {
      setCsvStatus("running");
      setErrorMessage(null);
    },
    onSuccess: () => setCsvStatus("done"),
    onError: (error: unknown) => {
      setCsvStatus("error");
      setErrorMessage(
        getApiErrorMessage(error, "Impossible de télécharger le récapitulatif."),
      );
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {errorMessage && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {errorMessage}
        </p>
      )}

      {jsonStatus === "done" && lastExport && (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3">
          <p
            role="status"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-success)]"
          >
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            Export téléchargé — voici ce qu&apos;il contient :
          </p>
          <ExportSummary data={lastExport} />
        </div>
      )}

      {csvStatus === "done" && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Récapitulatif téléchargé — ouvrez le fichier CSV dans votre tableur.
        </p>
      )}

      <HudPanel className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--dg-text)]">
            <Database aria-hidden className="size-4 text-[var(--dg-accent-bright)]" />
            Exporter mes données (JSON)
          </h2>
          <p className="text-sm text-[var(--dg-text-muted)]">
            Téléchargez un fichier structuré et lisible de toutes les
            informations que la ville conserve sur vous : profil, demandes,
            soutiens, préoccupations, rendez-vous, notifications, sécurité et
            sessions (droit d&apos;accès RGPD).
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void exportJson.mutate()}
          disabled={exportJson.isPending}
          className="dg-btn-accent w-full sm:w-auto"
        >
          {exportJson.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Génération en cours…
            </>
          ) : (
            <>
              <Download aria-hidden />
              Télécharger mes données
            </>
          )}
        </Button>
      </HudPanel>

      <HudPanel className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--dg-text)]">
            <FileSpreadsheet aria-hidden className="size-4 text-[var(--dg-accent-bright)]" />
            Récapitulatif de mes demandes (CSV)
          </h2>
          <p className="text-sm text-[var(--dg-text-muted)]">
            Téléchargez un tableau récapitulatif de toutes vos demandes
            (références, statuts, priorités…) ouvrable dans Excel, LibreOffice
            ou Google Sheets.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void exportCsv.mutate()}
          disabled={exportCsv.isPending}
          className="dg-btn-accent w-full sm:w-auto"
        >
          {exportCsv.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Préparation en cours…
            </>
          ) : (
            <>
              <Download aria-hidden />
              Télécharger le CSV
            </>
          )}
        </Button>
      </HudPanel>
    </div>
  );
}