import {
  Building2,
  Newspaper,
  MessageSquare,
  AlertTriangle,
  CalendarCheck,
  RefreshCw,
} from "lucide-react";
import TextFade from "@/components/animations/text/TextFade";
import Reveal from "./reveal";

const services = [
  {
    index: "01",
    icon: Building2,
    title: "Accéder aux services",
    description:
      "Démarches, identité numérique et services publics de la ville, réunis en un seul endroit.",
  },
  {
    index: "02",
    icon: Newspaper,
    title: "S'informer",
    description:
      "Actualités du Haut Conseil, alertes et vie de la ville, en temps réel.",
  },
  {
    index: "03",
    icon: MessageSquare,
    title: "Communiquer",
    description:
      "Échanger entre habitants et avec les institutions, simplement et en toute sécurité.",
  },
  {
    index: "04",
    icon: AlertTriangle,
    title: "Signaler un problème",
    description:
      "Un dysfonctionnement ? Signalez-le, suivez sa prise en charge jusqu'à la résolution.",
  },
  {
    index: "05",
    icon: CalendarCheck,
    title: "Faciliter le quotidien",
    description:
      "Transports, énergie, réservations : les bons outils pour vivre dans la ville.",
  },
  {
    index: "06",
    icon: RefreshCw,
    title: "Grandir avec la ville",
    description:
      "De nouvelles demandes arrivent en continu via l'API. La plateforme s'adapte.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="dg-container">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="dg-eyebrow mb-4">Services de la ville</p>
          <TextFade
            text="Tout ce dont une jeune ville a besoin."
            as="h2"
            className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em]"
          />
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map(({ index, icon: Icon, title, description }, i) => (
            <Reveal key={index} delay={(i % 3) * 0.08}>
              <article className="dg-card dg-card-hover group relative h-full overflow-hidden p-8">
                <div
                  className="absolute -right-16 -top-16 size-44 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(closest-side, var(--dg-accent-glow), transparent)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="text-sm font-semibold text-[var(--dg-accent-bright)]">
                      #{index}
                    </span>
                    <span className="grid size-11 place-items-center rounded-full border border-[var(--dg-border)] bg-white/[0.04]">
                      <Icon className="size-5 text-[var(--dg-text)]" />
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--dg-text)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--dg-text-muted)]">
                    {description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}