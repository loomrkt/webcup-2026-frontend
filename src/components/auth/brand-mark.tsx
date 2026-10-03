import Link from "next/link";
import TransitionLink from "@/components/pageTransitions/TransitionLink";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
       <TransitionLink href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Terra Nova" className="h-8 w-auto" />
            <span className="text-sm font-bold tracking-[0.18em] text-[var(--dg-text)]">
              TERRA&nbsp;NOVA
            </span>
       </TransitionLink>
    </div>
  );
}