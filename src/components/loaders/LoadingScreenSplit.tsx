"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface LoadingScreenSplitProps {
    onComplete: () => void;
}

const LoadingScreenSplit = ({ onComplete }: LoadingScreenSplitProps) => {
    const root = useRef<HTMLDivElement | null>(null);
    const left = useRef<HTMLDivElement | null>(null);
    const right = useRef<HTMLDivElement | null>(null);
    const line = useRef<HTMLDivElement | null>(null);
    const finished = useRef(false);

    useGSAP(
        () => {
            if (!root.current || !left.current || !right.current || !line.current)
                return;

            const finish = () => {
                if (finished.current) return;
                finished.current = true;
                onComplete();
            };

            if (prefersReducedMotion()) {
                finish();
                return;
            }

            const tl = gsap.timeline({
                onComplete: finish,
            });

            tl.fromTo(
                line.current,
                { height: "0%" },
                {
                    height: "100%",
                    duration: 0.7,
                    ease: "power2.inOut",
                },
            ).to(
                [left.current, right.current],
                {
                    x: (_index, target) =>
                        target === left.current ? "-100%" : "100%",
                    duration: 0.9,
                    ease: "power3.inOut",
                },
                "+=0.1",
            );

            return () => {
                tl.kill();
            };
        },
        { dependencies: [] },
    );

    return (
        <div
            ref={root}
            className="fixed inset-0 z-50 flex overflow-hidden"
            style={{ background: "var(--dg-bg)" }}
            aria-hidden="true"
        >
            <div
                ref={left}
                className="h-full w-1/2"
                style={{ background: "var(--dg-bg-raised)" }}
            />
            <div
                ref={line}
                className="relative z-10 w-px"
                style={{
                    background: "var(--dg-accent-bright)",
                    boxShadow: "0 0 24px var(--dg-accent-glow)",
                }}
            />
            <div
                ref={right}
                className="h-full w-1/2"
                style={{ background: "var(--dg-bg-raised)" }}
            />
        </div>
    );
};

export default LoadingScreenSplit;