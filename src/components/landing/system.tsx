import { TerminalSquare, ShieldCheck } from "lucide-react";
import TextStretch from "@/components/animations/text/TextStretch";
import RequestFeed from "./request-feed";
import Reveal from "./reveal";

const criteria = ["Utile", "Fonctionnelle", "Accessible", "Sécurisée", "Évolutive"];

export default function System() {
  return (
    <section id="systeme" className="relative py-28 md:py-36">
      <div className="dg-container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="dg-eyebrow mb-4">Le système de demandes</p>
          <TextStretch
            text="La ville parle. La plateforme écoute."
            as="h2"
            className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em]"
          />
          <p className="mt-6 max-w-[46ch] leading-relaxed text-[var(--dg-text-muted)]">
            Les habitants et le Haut Conseil expriment leurs besoins via l’API
            officielle de Terra Nova. Certaines demandes nous attendent déjà,
            d’autres apparaîtront au fil des prochaines heures. La plateforme les
            transforme en fonctionnalités utilisables — et reste prête pour les
            imprévus.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {criteria.map((c) => (
              <span key={c} className="dg-chip dg-chip-accent">
                <ShieldCheck className="size-3.5" />
                {c}
              </span>
            ))}
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="relative">
            <div
              className="dg-glow dg-glow-pulse -inset-8 opacity-70"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[20px] border border-white/15 bg-[var(--dg-bg-raised)] shadow-[0_0_60px_var(--dg-accent-glow)]">
              <div className="flex items-center gap-2 border-b border-[var(--dg-border)] bg-white/[0.03] px-5 py-3">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 flex flex-1 items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-[var(--dg-text-muted)]">
                  <TerminalSquare className="size-3.5" />
                  terra-nova.habitat/demandes
                </span>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--dg-text)]">
                    Demandes entrantes
                  </p>
                  <span className="flex items-center gap-1.5 rounded-full border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-2.5 py-1 text-xs font-medium text-[var(--dg-success)]">
                    <span className="dg-animate size-1.5 rounded-full bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)] [animation:dg-glow-pulse_3s_ease-in-out_infinite]" />
                    API en ligne
                  </span>
                </div>
                <RequestFeed />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
