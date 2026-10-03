import { ConsultationList } from "@/features/consultations/components/consultation-list";

export default function ConsultationsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Participation citoyenne</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Consultations
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Le Haut Conseil soumet certaines décisions à l&apos;avis des
          habitants. Répondez aux consultations ouvertes et consultez les
          résultats.
        </p>
      </header>

      <ConsultationList />
    </div>
  );
}