"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAccessibilityStore } from "@/stores/accessibility-store";

/**
 * Terme du glossaire inséré dans un contenu : bouton dépliable qui révèle
 * la définition en langage simple. En mode « langage simple » (réglage
 * d'accessibilité), la définition est affichée automatiquement via CSS.
 */
export function GlossaryTerm({
  term,
  definition,
  className,
}: {
  term: string;
  definition: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const plainLanguage = useAccessibilityStore((s) => s.preferences.plainLanguage);
  const expanded = open || plainLanguage;

  return (
    <span
      data-open={expanded ? "true" : "false"}
      className={cn("glossary-term inline", className)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={expanded}
        className="glossary-term-button inline cursor-pointer border-b border-dotted border-[var(--dg-accent)]/70 font-medium text-[var(--dg-accent-bright)] underline-offset-4 hover:border-solid focus-visible:outline-none"
      >
        {term}
      </button>
      <span className="glossary-definition mt-1.5 block rounded-lg border border-[var(--dg-border)] bg-[var(--dg-bg-raised)] px-3 py-2 text-sm leading-relaxed text-[var(--dg-text-muted)]">
        {definition}
      </span>
    </span>
  );
}