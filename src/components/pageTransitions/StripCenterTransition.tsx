"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { PageTransitionProps } from "./types";

const stripCount = 11;
const centerIndex = Math.floor(stripCount / 2);
const delayPerStrip = 0.1;
const stripDuration = 0.7;

const StripCenterTransition: React.FC<PageTransitionProps> = ({
    phase,
    onComplete,
}) => {
    const halves = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(
        () => {
            if (prefersReducedMotion()) {
                if (phase === "reveal") onComplete?.();
                return;
            }

            const targets = halves.current.filter(
                (el) => el !== null,
            ) as HTMLDivElement[];
            const tl = gsap.timeline();

            targets.forEach((el) => {
                const isTop = el.dataset.half === "top";
                const delay = Math.abs(Number(el.dataset.index) - centerIndex) *
                    delayPerStrip;

                if (phase === "cover") {
                    tl.to(
                        el,
                        {
                            y: 0,
                            duration: stripDuration,
                            ease: "power3.inOut",
                            delay,
                        },
                        0,
                    );
                } else {
                    tl.to(
                        el,
                        {
                            y: isTop ? "-100%" : "100%",
                            duration: stripDuration,
                            ease: "power3.inOut",
                            delay,
                        },
                        0,
                    );
                }
            });

            if (phase === "reveal") {
                tl.call(() => onComplete?.());
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
                    className="relative h-full"
                    style={{ width: `${100 / stripCount}%` }}
                >
                    <div
                        ref={(el) => {
                            halves.current[index * 2] = el;
                        }}
                        data-half="top"
                        data-index={index}
                        className="absolute inset-x-0 top-0 h-1/2"
                        style={{
                            background: "var(--dg-bg-raised)",
                            transform: "translateY(-100%)",
                        }}
                    />
                    <div
                        ref={(el) => {
                            halves.current[index * 2 + 1] = el;
                        }}
                        data-half="bottom"
                        data-index={index}
                        className="absolute inset-x-0 bottom-0 h-1/2"
                        style={{
                            background: "var(--dg-bg)",
                            transform: "translateY(100%)",
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default StripCenterTransition;