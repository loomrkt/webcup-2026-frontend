"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { PageTransitionProps } from "./types";

const stripCount = 5;
const delayPerStrip = 0.1;
const stripDuration = 0.65;

const StripTransition: React.FC<PageTransitionProps> = ({
    phase,
    onComplete,
}) => {
    const strips = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(
        () => {
            if (prefersReducedMotion()) {
                if (phase === "reveal") onComplete?.();
                return;
            }

            const targets = strips.current.filter(
                (el) => el !== null,
            ) as HTMLDivElement[];

            const tl = gsap.timeline();

            if (phase === "cover") {
                tl.to(targets, {
                    y: 0,
                    duration: stripDuration,
                    ease: "power3.inOut",
                    stagger: delayPerStrip,
                });
            } else {
                tl.to(targets, {
                    y: "-100vh",
                    duration: stripDuration,
                    ease: "power3.inOut",
                    stagger: delayPerStrip,
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
        <div className="fixed inset-0 z-[100] flex">
            {Array.from({ length: stripCount }).map((_, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        strips.current[index] = el;
                    }}
                    className="h-full"
                    style={{
                        width: `${100 / stripCount}%`,
                        background: index % 2 === 0
                            ? "var(--dg-bg-raised)"
                            : "var(--dg-bg)",
                        transform: "translateY(-100vh)",
                    }}
                />
            ))}
        </div>
    );
};

export default StripTransition;