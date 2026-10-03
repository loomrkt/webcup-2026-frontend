"use client";

import { BusFront, Clock, Info } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";
import type { MobilityLineDetail } from "@/entities/mobility";
import { cn } from "@/lib/utils";

const DAY_OPTIONS = [
  { value: "today", label: "Aujourd'hui" },
  { value: "weekday", label: "Semaine" },
  { value: "saturday", label: "Samedi" },
  { value: "sunday", label: "Dimanche" },
] as const;

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

export function MobilityLineDetailView({
  line,
  schedules,
  day,
  onDayChange,
}: {
  line: MobilityLineDetail;
  schedules: MobilityLineDetail["schedules"];
  day: string;
  onDayChange: (day: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <HudPanel edge className="flex flex-col gap-4 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "flex h-12 min-w-12 shrink-0 items-center justify-center rounded-xl px-2 font-mono text-base font-bold",
                  line.color ? "" : "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]",
                )}
                style={
                  line.color
                    ? { backgroundColor: `${line.color}33`, color: line.color }
                    : undefined
                }
              >
                {line.code}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-white">
                  {line.name}
                </h2>
                {line.origin || line.destination ? (
                  <p className="text-xs text-[var(--dg-text-muted)]">
                    {line.origin ?? "—"} → {line.destination ?? "—"}
                  </p>
                ) : null}
              </div>
              {line.accessible ? (
                <span className="hud-chip border border-[var(--dg-success-border)] bg-[var(--dg-success)]/15 px-2 py-0.5 text-[10px] text-[var(--dg-success)]">
                  Accessible
                </span>
              ) : null}
            </div>

            {line.info ? (
              <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--dg-text-muted)]">
                <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--dg-accent-bright)]" />
                {line.info}
              </p>
            ) : null}
          </HudPanel>

          <HudPanel edge className="flex flex-col gap-3 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <Clock className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Horaires de départ
            </h2>

            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Jour des horaires">
              {DAY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onDayChange(option.value)}
                  className={cn(
                    "inline-flex cursor-pointer items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    day === option.value
                      ? "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border border-[var(--dg-accent)]/40"
                      : "text-[var(--dg-text-muted)] border border-transparent hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {schedules.length === 0 ? (
              <p className="text-sm text-[var(--dg-text-faint)]">
                Aucun départ programmé pour ce jour.
              </p>
            ) : (
              <div
                role="list"
                className="grid max-h-72 gap-1.5 overflow-y-auto sm:grid-cols-2"
                aria-label="Horaires"
              >
                {schedules.map((schedule, index) => (
                  <div
                    key={`${schedule.departureTime}-${index}`}
                    role="listitem"
                    className="hud-cut flex items-center justify-between gap-2 rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-2.5 py-1.5"
                  >
                    <span className="font-mono text-sm font-semibold text-white">
                      {schedule.departureTime}
                    </span>
                    <span className="truncate text-[11px] text-[var(--dg-text-faint)]">
                      {schedule.destination ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </HudPanel>
        </div>

        <div className="flex flex-col gap-4">
          <HudPanel edge className="flex flex-col gap-3 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
              <BusFront className="h-4 w-4 text-[var(--dg-accent-bright)]" />
              Informations pratiques
            </h2>
            <div className="grid gap-3">
              <InfoItem label="Fréquence" value={line.frequency} />
              <InfoItem label="Tarif" value={line.price} />
              <InfoItem
                label="Accessibilité"
                value={line.accessible ? "Oui" : "Non"}
              />
            </div>
          </HudPanel>
        </div>
      </div>
    </div>
  );
}