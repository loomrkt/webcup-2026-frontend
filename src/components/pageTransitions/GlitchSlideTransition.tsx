"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { PageTransitionProps } from "./types";

const GlitchSlideTransition: React.FC<PageTransitionProps> = ({
    phase,
    onComplete,
}) => {
    const slide = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!slide.current) return;

            if (prefersReducedMotion()) {
                if (phase === "reveal") onComplete?.();
                return;
            }

            const tl = gsap.timeline();

            if (phase === "cover") {
                tl.to(slide.current, {
                    y: 0,
                    duration: 0.7,
                    ease: "back.out(1.6)",
                });
            } else {
                tl.to(slide.current, {
                    y: "-100%",
                    duration: 0.7,
                    ease: "power3.in",
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
                ref={slide}
                className="absolute inset-x-0 top-0 h-full"
                style={{
                    background:
                        "linear-gradient(180deg, var(--dg-accent-bright), var(--dg-accent-deep))",
                    transform: "translateY(-100%)",
                }}
            />
        </div>
    );
};

export default GlitchSlideTransition;