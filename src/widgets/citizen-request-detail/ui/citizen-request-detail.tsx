"use client";

import { MapPin } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import type { Request } from "@/entities/request";
import { formatDateTime } from "@/helpers/format";

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wider text-[var(--dg-text-faint)] uppercase">
        {label}
      </span>
      <span className="text-sm text-[var(--dg-text)]">{value ?? "—"}</span>
    </div>
  );
}

export function CitizenRequestDetail({ request }: { request: Request }) {
  return (
    <div className="flex flex-col gap-4">
      <HudPanel edge className="flex flex-col gap-3 p-4">
        <h2 className="text-sm font-semibold text-[var(--dg-text)]">
          Détails de la demande
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Service concerné"
            value={request.service?.name}
          />
          <InfoItem label="Catégorie" value={request.category} />
          <InfoItem
            label="Localisation"
            value={
              request.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--dg-accent-bright)]" />
                  {request.location}
                </span>
              ) : null
            }
          />
          <InfoItem label="Déposée le" value={formatDateTime(request.createdAt)} />
          <InfoItem
            label="Mise à jour le"
            value={formatDateTime(request.updatedAt)}
          />
        </div>
      </HudPanel>

      <HudPanel edge className="flex flex-col gap-3 p-4">
        <h2 className="text-sm font-semibold text-[var(--dg-text)]">
          Description
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--dg-text-muted)]">
          {request.description}
        </p>
      </HudPanel>
    </div>
  );
}