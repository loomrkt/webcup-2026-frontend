export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md animate-[float-slow_7s_ease-in-out_infinite] motion-reduce:animate-none">
      <div className="relative animate-[card-glow_6s_ease-in-out_infinite] rounded-2xl border border-cyan-400/20 bg-white/[0.03] p-8 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-xl motion-reduce:animate-none sm:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px animate-[border-flow_8s_ease-in-out_infinite] bg-gradient-to-r from-cyan-400/0 via-violet-400/70 to-cyan-400/0 bg-[length:200%_100%] motion-reduce:animate-none" />
        {children}
      </div>
    </div>
  );
}