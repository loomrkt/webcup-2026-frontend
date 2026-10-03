import {
  Landmark,
  Rocket,
  Zap,
  Radio,
  Orbit,
  Droplets,
} from "lucide-react";

const institutions = [
  { icon: Landmark, name: "Haut Conseil" },
  { icon: Rocket, name: "Port spatial" },
  { icon: Zap, name: "Réseau énergie" },
  { icon: Radio, name: "Comm' Nova" },
  { icon: Orbit, name: "Transport orbital" },
  { icon: Droplets, name: "Cycle de l'eau" },
];

export default function LogoStrip() {
  return (
    <section id="ville" className="relative z-10 -mt-6">
      <div className="dg-container">
        <div className="rounded-[28px] border border-[var(--dg-border)] bg-[var(--dg-bg-raised)] px-6 py-8 md:px-10">
          <p className="mb-7 text-center text-sm font-semibold text-[var(--dg-text-muted)]">
            La ville grandit avec vous
          </p>
          <div
            className="grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 55%, transparent 96%)",
              maskImage: "linear-gradient(to bottom, #000 55%, transparent 96%)",
            }}
          >
            {institutions.map(({ icon: Icon, name }) => (
              <div
                key={name}
                className="flex items-center justify-center gap-2 opacity-60 grayscale"
              >
                <Icon className="size-4 text-white/70" />
                <span className="text-sm font-medium text-white/80">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
