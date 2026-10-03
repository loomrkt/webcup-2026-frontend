import Link from "next/link";
import { Orbit } from "lucide-react";

const links = [
  { href: "#ville", label: "La ville" },
  { href: "#services", label: "Services" },
  { href: "#mission", label: "Mission" },
  { href: "#systeme", label: "Système" },
];

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="dg-container flex items-center justify-between py-6">
        <Link href="#" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-[var(--dg-accent)]/15 ring-1 ring-[var(--dg-accent)]/30">
            <Orbit className="size-4 text-[var(--dg-accent-bright)]" />
          </span>
          <span className="text-sm font-bold tracking-[0.18em] text-[var(--dg-text)]">
            TERRA&nbsp;NOVA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/login" className="dg-btn-primary !px-5 !py-2.5">
          Accéder à la plateforme
        </Link>
      </div>
    </header>
  );
}
