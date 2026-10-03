import { Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  wordmark?: boolean;
}

export function Logo({ className, wordmark = true }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-full bg-[var(--dg-accent)]/15 ring-1 ring-[var(--dg-accent)]/30">
        <Orbit className="size-4 text-[var(--dg-accent-bright)]" />
      </span>
      {wordmark && (
        <span className="text-sm font-bold tracking-[0.18em] text-[var(--dg-text)]">
          TERRA&nbsp;NOVA
        </span>
      )}
    </span>
  );
}