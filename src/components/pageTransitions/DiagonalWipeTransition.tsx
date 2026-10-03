"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { PageTransitionProps } from "./types";

const DiagonalWipeTransition: React.FC<PageTransitionProps> = ({
    phase,
    onComplete,
}) => {
    const block = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!block.current) return;

            if (prefersReducedMotion()) {
                if (phase === "reveal") onComplete?.();
                return;
            }

            const tl = gsap.timeline();

            if (phase === "cover") {
                tl.to(block.current, {
                    scale: 1,
                    duration: 0.75,
                    ease: "power3.inOut",
                });
            } else {
                tl.to(block.current, {
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
                ref={block}
                className="absolute inset-x-0 bottom-0 h-[120%]"
                style={{
                    background:
                        "linear-gradient(135deg, var(--dg-accent-deep), var(--dg-bg-raised) 70%)",
                    borderRadius: "100%",
                    transformOrigin: "50% 100%",
                    transform: "scale(0)",
                }}
            />
        </div>
    );
};

export default DiagonalWipeTransition;