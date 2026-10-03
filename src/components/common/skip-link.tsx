export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:border focus:border-[var(--dg-accent-border)] focus:bg-[var(--dg-bg-raised)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--dg-accent-bright)] focus:shadow-[0_0_20px_var(--dg-accent-glow)] focus:outline-none"
    >
      Aller au contenu
    </a>
  );
}