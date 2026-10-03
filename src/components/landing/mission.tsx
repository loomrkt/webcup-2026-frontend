import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./reveal";

export default function Mission() {
  return (
    <section id="mission" className="relative py-28 md:py-36">
      <div className="dg-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="dg-eyebrow mb-4">Notre mission</p>
          <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            Une ville jeune, des besoins nouveaux.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xl font-semibold leading-snug text-[var(--dg-text)]">
            Les premières infrastructures sont en place. Les habitants s’installent.
            Et de nouveaux besoins apparaissent, chaque jour.
          </p>
          <p className="mt-5 max-w-[46ch] leading-relaxed text-[var(--dg-text-muted)]">
            Accéder aux services, s’informer, communiquer, signaler un problème,
            faciliter la vie quotidienne… Le Haut Conseil a confié au système de
            demandes le soin d’exprimer ces besoins. Notre plateforme les écoute et
            les transforme en fonctionnalités réelles.
          </p>
          <Link href="#systeme" className="dg-btn-primary mt-8">
            Voir le système de demandes
            <span className="grid size-6 place-items-center rounded-full bg-white/20">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
