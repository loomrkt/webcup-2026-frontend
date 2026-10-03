"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { PageTransitionProps } from "./types";

const ZoomBurstTransition: React.FC<PageTransitionProps> = ({
    phase,
    onComplete,
}) => {
    const burst = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!burst.current) return;

            if (prefersReducedMotion()) {
                if (phase === "reveal") onComplete?.();
                return;
            }

            const tl = gsap.timeline();

            if (phase === "cover") {
                tl.to(burst.current, {
                    scale: 3,
                    duration: 0.75,
                    ease: "power3.inOut",
                });
            } else {
                tl.to(burst.current, {
                    scale: 0,
                    duration: 0.75,
                    ease: "power3.inOut",
                    onComplete: () => onComplete?.(),
                });
            }

            return () => {
                tl.kill();
            };
        },
        { dependencies: [phase] },
    );

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div
                ref={burst}
                className="absolute size-full"
                style={{
                    background:
                        "radial-gradient(closest-side, var(--dg-accent), var(--dg-accent-deep) 70%)",
                    borderRadius: "100%",
                    transformOrigin: "50% 50%",
                    transform: "scale(0)",
                }}
            />
        </div>
    );
};

export default ZoomBurstTransition;