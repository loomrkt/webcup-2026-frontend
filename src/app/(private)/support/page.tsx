import { SupportRequestPage } from "@/features/support/components/support-request-page";
import { HudPanel } from "@/components/ui/hud-panel";

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Participation citoyenne</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Soutenir une demande
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Une demande déposée par un autre habitant vous semble utile ?
          Soutenez-la pour la faire remonter auprès du Haut Conseil.
        </p>
      </header>

      <HudPanel className="p-5">
        <SupportRequestPage />
      </HudPanel>
    </div>
  );
}