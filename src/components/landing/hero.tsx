"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onAppLoaded } from "@/helpers/loader-events";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAppLoaded(() => setReady(true));
    return unsubscribe;
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".dg-hero-line > span",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.15, stagger: 0.12 },
        0.15
      )
        .fromTo(
          ".hero-fade",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 },
          0.75
        );
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <section
      ref={root}
      data-accent="violet"
      className="dg-grain relative flex min-h-svh flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 100% at 78% 12%, rgba(139,108,255,0.28), rgba(58,31,181,0.18) 42%, var(--dg-bg) 76%)",
      }}
    >
      <div
        className="dg-glow dg-glow-pulse left-1/2 top-[46%] -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-70"
        aria-hidden="true"
      />

      <div className="dg-fade-bottom absolute inset-0 z-0" aria-hidden="true">
        <HeroScene />
      </div>

      <div className="dg-container relative z-90 flex flex-1 flex-col items-center justify-center pb-40 pt-36 text-center">
        <h1
          className={`${ready ? "" : "invisible"} text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em]`}
        >
          <span className="dg-hero-line">
            <span>La première ville</span>
          </span>
          <span className="dg-hero-line">
            <span className="dg-text-gradient">d’un nouveau monde.</span>
          </span>
        </h1>

        <p className={`hero-fade ${ready ? "" : "invisible"} mx-auto mt-8 max-w-[560px] text-base leading-relaxed text-[var(--dg-text-muted)] md:text-lg`}>
          Après des décennies d’exploration, l’humanité a fondé sa première
          ville hors de la Terre. Le Haut Conseil vous confie une mission :
          construire sa plateforme numérique centrale.
        </p>

        <div className={`hero-fade ${ready ? "" : "invisible"} mt-10 flex flex-col items-center gap-3 sm:flex-row`}>
          <Link href="#mission" className="dg-btn-primary">
            Découvrir la mission
            <span className="grid size-6 place-items-center rounded-full bg-white/20">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
          <TransitionLink href="/login" className="dg-btn-ghost">
            Accéder à la plateforme
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}