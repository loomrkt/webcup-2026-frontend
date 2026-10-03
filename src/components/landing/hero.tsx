"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => null,
});

const stats = [
  { value: "0", label: "jours d’existence" },
  { value: "24h", label: "pour bâtir la ville" },
  { value: "1", label: "mission : le cœur numérique" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-line > span",
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
    { scope: root }
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

      <div className="dg-container relative z-10 flex flex-1 flex-col items-center justify-center pb-40 pt-36 text-center">
        <span className="hero-fade dg-chip dg-chip-accent mb-8 opacity-0">
          <span aria-hidden="true">✦</span>
          Le Haut Conseil de Terra Nova ouvre sa mission
        </span>

        <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em]">
          <span className="dg-hero-line">
            <span>La première ville</span>
          </span>
          <span className="dg-hero-line">
            <span className="dg-text-gradient">d’un nouveau monde.</span>
          </span>
        </h1>

        <p className="hero-fade mx-auto mt-8 max-w-[560px] text-base leading-relaxed text-[var(--dg-text-muted)] opacity-0 md:text-lg">
          Après des décennies d’exploration, l’humanité a fondé sa première
          ville hors de la Terre. Le Haut Conseil vous confie une mission :
          construire sa plateforme numérique centrale.
        </p>

        <div className="hero-fade mt-10 flex flex-col items-center gap-3 opacity-0 sm:flex-row">
          <Link href="#mission" className="dg-btn-primary">
            Découvrir la mission
            <span className="grid size-6 place-items-center rounded-full bg-white/20">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
          <Link href="/login" className="dg-btn-ghost">
            Accéder à la plateforme
          </Link>
        </div>

        <div className="hero-fade mt-16 flex flex-wrap items-center justify-center gap-3 opacity-0">
          {stats.map((s) => (
            <span key={s.label} className="dg-chip">
              <span className="font-semibold text-[var(--dg-text)]">{s.value}</span>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0">
        <span className="flex flex-col items-center gap-2 text-[var(--dg-text-faint)]">
          <span className="text-[0.7rem] uppercase tracking-[0.2em]">Défiler</span>
          <ArrowDown className="size-4 animate-bounce" />
        </span>
      </div>
    </section>
  );
}
