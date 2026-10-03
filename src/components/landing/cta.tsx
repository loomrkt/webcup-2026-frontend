import { ArrowRight } from "lucide-react";
import TextLift from "@/components/animations/text/TextLift";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

export default function Cta() {
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 100%, rgba(139,108,255,0.22), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="dg-container">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="dg-eyebrow mb-4">Dans les prochaines 24 heures</p>
          <TextLift
            text="Terra Nova écrit son histoire.<br/><span class='dg-text-gradient'>Construisons son cœur numérique.</span>"
            as="h2"
            className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em]"
          />
          <p className="mx-auto mt-6 max-w-[46ch] leading-relaxed text-[var(--dg-text-muted)]">
            Rejoignez la mission confiée par le Haut Conseil. Découvrez les
            demandes des habitants, comprenez-les, transformez-les en
            fonctionnalités réelles.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TransitionLink href="/login" className="dg-btn-primary !px-8 !py-3.5 text-base">
              Accéder à la plateforme
              <span className="grid size-6 place-items-center rounded-full bg-white/20">
                <ArrowRight className="size-3.5" />
              </span>
            </TransitionLink>
            <a href="#services" className="dg-btn-ghost !px-8 !py-3.5 text-base">
              Découvrir les services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}