import { Zap } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--dg-accent-bright)] to-[var(--dg-accent-deep)] shadow-[0_0_28px_var(--dg-accent-glow)]">
        <Zap className="size-5 fill-current text-white" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="text-lg font-bold tracking-tight text-[var(--dg-text)]">
          Loomrkt
        </p>
        <p className="text-[11px] text-[var(--dg-text-faint)]">
          Votre marché, réinventé
        </p>
      </div>
    </div>
  );
}