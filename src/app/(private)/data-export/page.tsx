import { DataExport } from "@/features/privacy/components/data-export";

export default function DataExportPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Données & vie privée</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Export de mes données
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Récupérez les informations que la ville possède sur vous, dans un
          format clair et exploitable.
        </p>
      </header>

      <DataExport />
    </div>
  );
}