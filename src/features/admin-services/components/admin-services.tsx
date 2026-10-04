"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleAlert, History, Power, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import {
  fetchAdminServices,
  fetchServiceStatusHistory,
} from "@/services/services/services-service";
import type { Service } from "@/services/services/types";
import { ServiceStatusBadge } from "@/features/services/components/service-status-badge";
import { AvailabilitySheet } from "./availability-sheet";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistorySheet({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["service-status-history", service.id],
    queryFn: () => fetchServiceStatusHistory(service.id),
    staleTime: 60_000,
  });

  const entries = data ?? [];

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full border-none bg-[var(--dg-bg-raised)] p-0 sm:max-w-[28rem]!"
      >
        <SheetHeader>
          <SheetTitle className="text-base font-semibold text-white">
            Historique — {service.name}
          </SheetTitle>
          <SheetDescription className="text-sm text-[var(--dg-text-muted)]">
            Journal des changements d&apos;état du service (50 derniers).
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-4">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl bg-white/10" />
              ))}
            </div>
          ) : isError ? (
            <p role="alert" className="text-xs text-[var(--dg-danger)]">
              Impossible de charger l&apos;historique.
            </p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-[var(--dg-text-muted)]">
              Aucun changement d&apos;état enregistré.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="hud-cut flex flex-col gap-1 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        entry.active
                          ? "text-[var(--dg-success)]"
                          : "text-[var(--dg-danger)]",
                      )}
                    >
                      {entry.active ? "Activé" : "Désactivé"} · {entry.status}
                    </span>
                    <span className="text-[10px] text-[var(--dg-text-faint)]">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  {entry.reason ? (
                    <p className="text-xs text-[var(--dg-text-muted)]">
                      {entry.reason}
                    </p>
                  ) : null}
                  {entry.changedBy?.email ? (
                    <p className="text-[10px] text-[var(--dg-text-faint)]">
                      Par {entry.changedBy.email}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function AdminServiceRow({
  service,
  onToggle,
  onHistory,
}: {
  service: Service;
  onToggle: (service: Service) => void;
  onHistory: (service: Service) => void;
}) {
  return (
    <li className="hud-cut flex flex-wrap items-center gap-3 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-white">
          {service.name}
          {!service.active ? (
            <span className="ml-2 text-[11px] text-[var(--dg-danger)]">
              (masqué aux habitants)
            </span>
          ) : null}
        </p>
        <p className="truncate text-[11px] text-[var(--dg-text-faint)]">
          {service.slug}
          {service.category ? ` · ${service.category}` : ""}
        </p>
      </div>
      <ServiceStatusBadge service={service} />
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onHistory(service)}
          aria-label={`Historique de ${service.name}`}
          className="cursor-pointer border border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-accent-bright)]"
        >
          <History aria-hidden />
        </Button>
        <Button
          variant={service.active ? "outline" : "default"}
          size="sm"
          onClick={() => onToggle(service)}
          className={cn(
            "cursor-pointer",
            !service.active && "dg-btn-accent",
          )}
        >
          <Power aria-hidden />
          {service.active ? "Désactiver" : "Réactiver"}
        </Button>
      </div>
    </li>
  );
}

function AdminServicesSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-7 w-72 bg-white/10" />
      <Skeleton className="h-4 w-96 bg-white/10" />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-16 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export function AdminServices() {
  const { isLoading: guardLoading, hasRole } = useRoleGuard();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [historyOf, setHistoryOf] = useState<Service | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-services"],
    queryFn: fetchAdminServices,
    staleTime: 60_000,
  });

  const services = data ?? [];

  if (guardLoading) return <AdminServicesSkeleton />;
  if (!hasRole(ROLES.ADMIN)) {
    return (
      <HudPanel
        tone="danger"
        className="flex flex-col items-center justify-center gap-4 p-10"
      >
        <Wrench className="h-12 w-12 text-[var(--dg-danger)]" />
        <h2 className="text-lg font-semibold text-[var(--dg-text)]">
          Accès refusé
        </h2>
        <p className="max-w-md text-center text-sm text-[var(--dg-text-muted)]">
          Cette section est réservée aux administrateurs du Haut Conseil de
          Terra Nova.
        </p>
      </HudPanel>
    );
  }

  const handleAvailabilityChanged = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    void queryClient.invalidateQueries({ queryKey: ["services-status"] });
    void queryClient.invalidateQueries({ queryKey: ["services"] });
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Haut Conseil · Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Gestion des services
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Désactivez rapidement un service défectueux (motif obligatoire) ou
          réactivez-le. Les habitants voient immédiatement l&apos;état mis à
          jour.
        </p>
      </header>

      {isError ? (
        <HudPanel
          tone="danger"
          className="flex flex-col items-center gap-3 p-8 text-center"
        >
          <CircleAlert aria-hidden className="h-8 w-8 text-[var(--dg-danger)]" />
          <p className="text-sm text-[var(--dg-text-muted)]">
            Impossible de charger les services.
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
            Réessayer
          </Button>
        </HudPanel>
      ) : isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {services.map((service) => (
            <AdminServiceRow
              key={service.id}
              service={service}
              onToggle={setEditing}
              onHistory={setHistoryOf}
            />
          ))}
        </ul>
      )}

      {editing && (
        <AvailabilitySheet
          service={editing}
          onClose={() => setEditing(null)}
          onChanged={handleAvailabilityChanged}
        />
      )}

      {historyOf && (
        <HistorySheet service={historyOf} onClose={() => setHistoryOf(null)} />
      )}
    </div>
  );
}