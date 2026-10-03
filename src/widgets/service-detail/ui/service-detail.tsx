"use client";

import { ArrowRight, Boxes, CalendarClock, CircleAlert, Clock } from "lucide-react";
import Link from "next/link";
import { HudPanel } from "@/components/ui/hud-panel";
import { ServiceStatusBadge } from "@/components/ui/service-status-badge";
import type { Service } from "@/entities/service";

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ServiceDetail({ service }: { service: Service }) {
  const impaired = service.status !== "available";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <HudPanel edge className="flex flex-col gap-4 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--dg-accent)]/10 text-[var(--dg-accent-bright)]"
              >
                <Boxes className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-white">
                  {service.name}
                </h2>
                {service.category ? (
                  <p className="text-xs text-[var(--dg-text-muted)]">
                    {service.category}
                  </p>
                ) : null}
              </div>
              <ServiceStatusBadge status={service.status} />
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--dg-text)]">
              {service.description || "Aucune description disponible pour ce service."}
            </p>

            {impaired && service.statusMessage ? (
              <div className="rounded-xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--dg-danger)]">
                  <CircleAlert className="h-4 w-4" />
                  Message de maintenance
                </p>
                <p className="mt-2 text-sm text-[var(--dg-text)]">
                  {service.statusMessage}
                </p>
              </div>
            ) : null}

            {service.resumeAt ? (
              <p className="flex items-center gap-2 text-xs text-[var(--dg-text-muted)]">
                <Clock className="h-4 w-4 text-[var(--dg-accent-bright)]" />
                Reprise estimée : {formatDateTime(service.resumeAt)}
              </p>
            ) : null}
          </HudPanel>
        </div>

        <div className="flex flex-col gap-4">
          <HudPanel edge className="flex flex-col gap-3 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <CalendarClock className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Informations
            </h2>
            <dl className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-[var(--dg-text-faint)]">Référence</dt>
                <dd className="font-mono text-[var(--dg-text-muted)]">
                  {service.id.slice(0, 8)}
                </dd>
              </div>
              {service.category ? (
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-[var(--dg-text-faint)]">Catégorie</dt>
                  <dd className="text-[var(--dg-text-muted)]">
                    {service.category}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <dt className="text-[var(--dg-text-faint)]">Mis à jour le</dt>
                <dd className="text-[var(--dg-text-muted)]">
                  {formatDate(service.updatedAt) ?? "—"}
                </dd>
              </div>
            </dl>
          </HudPanel>

          {service.alternativeService ? (
            <HudPanel edge className="flex flex-col gap-3 p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
                <ArrowRight className="h-4 w-4 text-[var(--dg-accent-bright)]" />
                Service alternatif
              </h2>
              <p className="text-xs text-[var(--dg-text-muted)]">
                En attendant le retour de ce service, vous pouvez utiliser :
              </p>
              <Link
                href={`/services/${service.alternativeService.id}`}
                className="hud-cut group flex items-center gap-2 rounded-xl border border-[var(--dg-accent)]/40 bg-[var(--dg-accent)]/10 px-3 py-2.5 text-sm text-white transition-colors hover:bg-[var(--dg-accent)]/20"
              >
                <span className="min-w-0 flex-1 truncate">
                  {service.alternativeService.name}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--dg-accent-bright)]" />
              </Link>
            </HudPanel>
          ) : null}
        </div>
      </div>
    </div>
  );
}