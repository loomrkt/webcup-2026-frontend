import { Hexagon, Zap } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Hexagon className="size-9 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" aria-hidden="true" />
        <Zap className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-violet-400" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="font-[family-name:var(--font-orbitron)] bg-gradient-to-r from-cyan-300 via-white to-violet-400 bg-clip-text text-lg font-bold tracking-[0.3em] text-transparent">
          LOOMRKT
        </p>
        <p className="font-[family-name:var(--font-jbm)] text-[9px] tracking-[0.35em] text-slate-500 uppercase">
          Auth protocol v2.0
        </p>
      </div>
    </div>
  );
}