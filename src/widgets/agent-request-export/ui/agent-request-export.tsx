"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { getApiErrorMessage } from "@/services/common/error-message";
import {
  downloadAllRequestsCsv,
  triggerDownload,
} from "@/services/privacy/privacy-service";

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AgentRequestExport() {
  const exportCsv = useMutation({
    mutationFn: async () => {
      const blob = await downloadAllRequestsCsv();
      triggerDownload(blob, `demandes-agents-${todayStamp()}.csv`);
    },
    onError: (error: unknown) => {
      void getApiErrorMessage(error, "Impossible de télécharger le CSV.");
    },
  });

  return (
    <HudPanel className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--dg-text)]">
          <FileSpreadsheet
            aria-hidden
            className="size-4 text-[var(--dg-accent-bright)]"
          />
          Exporter les demandes (CSV)
        </h2>
        <p className="text-sm text-[var(--dg-text-muted)]">
          Téléchargez un tableau récapitulatif de toutes les demandes reçues
          (références, statuts, priorités, services…) ouvrable dans Excel,
          LibreOffice ou Google Sheets.
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
            Exporter le CSV
          </>
        )}
      </Button>
      {exportCsv.isSuccess && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          CSV téléchargé — ouvrez-le dans votre tableur.
        </p>
      )}
    </HudPanel>
  );
}