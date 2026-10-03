import Link from "next/link";
import TransitionLink from "@/components/pageTransitions/TransitionLink";
import TextStretch from "@/components/animations/text/TextStretch";
import { Logo } from "@/helpers/icons";

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
  {
    title: "Équipe",
    links: [
      { label: "Nameno - Frontend developer", href: "https://nameno.vercel.app/" },
      { label: "Rino - Backend developer", href: "https://rins12.netlify.app/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-28 md:pt-36">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(130% 110% at 50% 115%, rgba(139,108,255,0.55) 0%, rgba(109,74,255,0.28) 35%, rgba(58,31,181,0.12) 55%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div className="dg-container relative">
        <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr] lg:gap-24">
          <div>
            <Logo size={46} />
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-[var(--dg-text-muted)]">
              La première ville d’un nouveau monde. Construite, habitée, et
              grandie par ses habitants.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16">
            {columns.map((col) => {
              const isEquipe = col.title.toLowerCase() === "équipe";

              return (
                <div key={col.title}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--dg-text-faint)]">
                    {col.title}
                  </p>
                  <ul className="space-y-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        {l.href.startsWith("/") ? (
                          <TransitionLink
                            href={l.href}
                            className="text-sm text-white/80 transition-colors hover:text-white"
                          >
                            {l.label}
                          </TransitionLink>
                        ) : (
                          <Link
                            href={l.href}
                            target={isEquipe ? "_blank" : undefined}
                            rel={isEquipe ? "noopener noreferrer" : undefined}
                            className="text-sm text-white/80 transition-colors hover:text-white"
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[var(--dg-border)] pt-6 text-xs text-[var(--dg-text-faint)] sm:flex-row">
          <p>© 2026 Haut Conseil de Terra Nova</p>
          <p>Première ville d’un nouveau monde.</p>
        </div>

        <div className="pointer-events-none select-none pt-14 text-center" aria-hidden="true">
          <TextStretch
            text="TERRA NOVA"
            as="p"
            className="text-[clamp(2.5rem,9vw,8.5rem)] font-bold leading-none tracking-[0.06em] text-white/10"
          />
        </div>
      </div>
    </footer>
  );
}