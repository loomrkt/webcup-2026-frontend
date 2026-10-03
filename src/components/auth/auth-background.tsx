export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(88,28,135,0.35),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,rgba(8,145,178,0.25),transparent)]" />

      <div className="absolute -left-40 -top-40 size-[36rem] animate-[aurora-shift_16s_ease-in-out_infinite] rounded-full bg-cyan-500/20 blur-[120px] motion-reduce:animate-none" />
      <div className="absolute -right-48 top-1/3 size-[32rem] animate-[aurora-shift_18s_ease-in-out_infinite_reverse] rounded-full bg-violet-600/25 blur-[120px] motion-reduce:animate-none" />
      <div className="absolute -bottom-48 left-1/3 size-[30rem] animate-[aurora-shift_20s_ease-in-out_infinite] rounded-full bg-fuchsia-500/15 blur-[130px] motion-reduce:animate-none" />

      <div className="absolute inset-0 animate-[grid-pan_22s_linear_infinite] bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:64px_64px] motion-reduce:animate-none [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,black,transparent)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="absolute inset-0 overflow-hidden opacity-40 motion-reduce:hidden">
        <div className="absolute inset-x-0 h-24 animate-[scan-sweep_8s_linear_infinite] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_60%,rgba(0,0,0,0.55))]" />
    </div>
  );
}