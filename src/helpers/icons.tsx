interface LogoProps {
  /** Taille de l'image en pixels ou valeur CSS (ex: 32, "2rem", "40px") */
  size?: number | string;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  const imageSize = typeof size === "number" ? `${size}px` : size;

  return (
    <>
      <img
        src="/logo.png"
        alt="Terra Nova"
        className={`w-auto object-contain ${className}`}
        style={{ height: imageSize }}
      />
      <span className="text-sm font-bold tracking-[0.18em] text-[var(--dg-text)]">
        TERRA&nbsp;NOVA
      </span>
    </>
  );
}