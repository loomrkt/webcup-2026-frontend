import { HudPanel } from "@/components/ui/hud-panel";
import type { Request } from "@/entities/request";

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

function citizenLabel(request: Request) {
  const { firstName, lastName, email } = request.citizen;
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }
  return email;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RequestInfo({ request }: { request: Request }) {
  return (
    <div className="flex flex-col gap-4">
      <HudPanel edge className="flex flex-col gap-3 p-4">
        <h2 className="text-sm font-semibold text-[var(--dg-text)]">
          Détails de la demande
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Citoyen" value={citizenLabel(request)} />
          <InfoItem label="Email" value={request.citizen.email} />
          <InfoItem
            label="Service concerné"
            value={request.service?.name}
          />
          <InfoItem label="Catégorie" value={request.category} />
          <InfoItem label="Localisation" value={request.location} />
          <InfoItem
            label="Assignée à"
            value={
              request.assignedTo
                ? request.assignedTo.firstName ?? request.assignedTo.email
                : null
            }
          />
          <InfoItem label="Créée le" value={formatDate(request.createdAt)} />
          <InfoItem
            label="Mise à jour le"
            value={formatDate(request.updatedAt)}
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

      {request.adminNote ? (
        <HudPanel edge className="flex flex-col gap-3 p-4">
          <h2 className="text-sm font-semibold text-[var(--dg-text)]">
            Note interne
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--dg-text-muted)]">
            {request.adminNote}
          </p>
        </HudPanel>
      ) : null}
    </div>
  );
}