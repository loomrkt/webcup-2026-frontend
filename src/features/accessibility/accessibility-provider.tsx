"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth/me-service";
import {
  applyPreferences,
  useAccessibilityStore,
} from "@/stores/accessibility-store";
import { applyEcoMode, useEcoStore } from "@/stores/eco-store";

function ColorBlindFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter id="cb-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
          />
        </filter>
        <filter id="cb-deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
          />
        </filter>
        <filter id="cb-tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function AccessibilityProvider({ children }: PropsWithChildren) {
  const { status } = useSession();
  const hydrateFromServer = useAccessibilityStore((s) => s.hydrateFromServer);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    applyPreferences(useAccessibilityStore.getState().preferences);
    applyEcoMode(useEcoStore.getState().ecoMode);
  }, []);

  useEffect(() => {
    if (me?.preferences) hydrateFromServer(me.preferences);
  }, [me, hydrateFromServer]);

  return (
    <>
      <ColorBlindFilters />
      {children}
    </>
  );
}