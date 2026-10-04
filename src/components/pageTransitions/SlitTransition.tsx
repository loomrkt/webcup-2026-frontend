"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { PageTransitionProps } from "./types";

const SlitTransition: React.FC<PageTransitionProps> = ({
    phase,
    onComplete,
}) => {
    const left = useRef<HTMLDivElement | null>(null);
    const right = useRef<HTMLDivElement | null>(null);
    const line = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!left.current || !right.current || !line.current) return;

            if (prefersReducedMotion()) {
                if (phase === "reveal") onComplete?.();
                return;
            }

            const tl = gsap.timeline();

            if (phase === "cover") {
                tl.to(
                    left.current,
                    { x: "0%", duration: 0.7, ease: "power3.inOut" },
                )
                    .to(
                        right.current,
                        { x: "0%", duration: 0.7, ease: "power3.inOut" },
                        "<",
                    )
                    .to(
                        line.current,
                        { scaleY: 1, duration: 0.7, ease: "power3.inOut" },
                        "<",
                    );
            } else {
                tl.to(left.current, {
                    x: "-100%",
                    duration: 0.7,
                    ease: "power3.inOut",
                })
                    .to(
                        right.current,
                        { x: "100%", duration: 0.7, ease: "power3.inOut" },
                        "<",
                    )
                    .to(
                        line.current,
                        { scaleY: 0.2, duration: 0.5, ease: "power3.out" },
                        0,
                    )
                    .add(() => onComplete?.());
            }

            return () => {
                tl.kill();
            };
        },
        { dependencies: [phase] },
    );

    return (
        <div className="fixed inset-0 z-[100] flex">
            <div
                ref={left}
                className="h-full w-1/2"
                style={{
                    background: "var(--dg-bg-raised)",
                    transform: "translateX(-100%)",
                }}
            />
            <div
                ref={line}
                className="relative z-10 w-px"
                style={{
                    background: "var(--dg-accent-bright)",
                    boxShadow: "0 0 24px var(--dg-accent-glow)",
                    transform: "scaleY(0.2)",
                }}
            />
            <div
                ref={right}
                className="h-full w-1/2"
                style={{
                    background: "var(--dg-bg-raised)",
                    transform: "translateX(100%)",
                }}
            />
        </div>
    );
};

export default SlitTransition;