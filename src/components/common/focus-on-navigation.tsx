"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Repositionne le focus sur le contenu principal après chaque navigation.
 * Sans cela, le focus est perdu (retour au <body>) lors des navigations
 * côté client, ce qui force l'utilisateur clavier à re-tabuler toute la page.
 */
export function FocusOnNavigation() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const active = document.activeElement;
    if (
      active &&
      active !== document.body &&
      active !== document.documentElement
    ) {
      return;
    }

    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}