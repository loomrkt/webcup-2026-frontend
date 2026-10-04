export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,var(--dg-accent-bright),var(--dg-accent-deep)_55%,var(--dg-bg)_100%)] opacity-40" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_8%,rgba(139,108,255,0.16),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_108%,rgba(58,31,181,0.22),transparent)]" />

      <div className="dg-animate absolute -left-40 -top-32 size-[34rem] rounded-full bg-[var(--dg-accent)]/20 blur-[120px] [animation:dg-glow-pulse_10s_ease-in-out_infinite]" />
      <div className="dg-animate absolute -right-48 top-1/4 size-[30rem] rounded-full bg-[var(--dg-accent-deep)]/30 blur-[130px] [animation:dg-glow-pulse_12s_ease-in-out_infinite_reverse]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_65%,rgba(0,0,0,0.5))]" />

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}