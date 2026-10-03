import { ServiceStatusPage } from "@/features/services/components/service-status-page";

export default function ServicesStatusPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Services municipaux</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          État des services
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Vérifiez l&apos;état d&apos;un service avant de commencer une
          démarche : opérationnel, perturbé ou indisponible, avec la prochaine
          action possible.
        </p>
      </header>

      <ServiceStatusPage />
    </div>
  );
}