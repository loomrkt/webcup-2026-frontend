import Link from "next/link";
import { Orbit } from "lucide-react";

const columns = [
  {
    title: "Ville",
    links: [
      { label: "Services", href: "#services" },
      { label: "Le système de demandes", href: "#systeme" },
      { label: "Notre mission", href: "#mission" },
    ],
  },
  {
    title: "Plateforme",
    links: [
      { label: "Accéder", href: "/login" },
      { label: "Créer un compte", href: "/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--dg-border)] py-14">
      <div className="dg-container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-[var(--dg-accent)]/15 ring-1 ring-[var(--dg-accent)]/30">
              <Orbit className="size-4 text-[var(--dg-accent-bright)]" />
            </span>
            <span className="text-sm font-bold tracking-[0.18em] text-[var(--dg-text)]">
              TERRA&nbsp;NOVA
            </span>
          </div>
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-[var(--dg-text-muted)]">
            La première ville d’un nouveau monde. Construite, habitée, et
            grandie par ses habitants.
          </p>
        </div>

        <div className="flex gap-16">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--dg-text-faint)]">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="dg-container mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--dg-border)] pt-6 text-xs text-[var(--dg-text-faint)] sm:flex-row">
        <p>© 2026 Haut Conseil de Terra Nova</p>
        <p>Première ville d’un nouveau monde.</p>
      </div>
    </footer>
  );
}
