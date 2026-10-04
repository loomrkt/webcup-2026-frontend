"use client";

import { useEffect, useState } from "react";
import { FilePlus2, CheckCircle2, Clock3 } from "lucide-react";

const pool = [
  { title: "Demande de carte d'habitant", meta: "Services municipaux" },
  { title: "Signalement : éclairage du dôme", meta: "Infrastructure" },
  { title: "Réservation de transport orbital", meta: "Mobilité" },
  { title: "Accès au rapport du Haut Conseil", meta: "Information" },
  { title: "Problème de distribution d'eau", meta: "Urgence" },
  { title: "Inscription à la médiathèque", meta: "Culture" },
  { title: "Échange de colis entre habitants", meta: "Communauté" },
];

export default function RequestFeed() {
  const [items, setItems] = useState(pool.slice(0, 3));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const next = pool[tick % pool.length];
        return [next, ...prev].slice(0, 4);
      });
      setTick((t) => t + 1);
    }, 2600);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <div
          key={`${item.title}-${tick - i}`}
          className="flex items-center gap-3 rounded-2xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--dg-accent)]/12 ring-1 ring-[var(--dg-accent)]/25">
            {i === 0 ? (
              <FilePlus2 className="size-4 text-[var(--dg-accent-bright)]" />
            ) : (
              <CheckCircle2 className="size-4 text-[var(--dg-success)]" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--dg-text)]">
              {item.title}
            </p>
            <p className="text-xs text-[var(--dg-text-faint)]">{item.meta}</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-[var(--dg-text-faint)]">
            <Clock3 className="size-3" />
            {i === 0 ? "à l'instant" : `${i * 2 + 2} min`}
          </span>
        </div>
      ))}
    </div>
  );
}
