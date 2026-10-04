export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="dg-animate w-full max-w-md [animation:dg-fade-up_0.6s_ease-out_both]">
      <div className="relative">
        <div
          className="absolute -inset-10 rounded-[48px] bg-[radial-gradient(closest-side,var(--dg-accent-glow),transparent)] blur-2xl"
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-3xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-8 backdrop-blur-xl sm:p-10">
          <div
            className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden="true"
          />
          {children}
        </div>
      </div>
    </div>
  );
}