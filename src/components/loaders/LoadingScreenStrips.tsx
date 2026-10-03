"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface LoadingScreenStripsProps {
    onComplete: () => void;
}

const stripCount = 8;
const delayPerStrip = 0.1;
const stripDuration = 0.8;

const LoadingScreenStrips = ({ onComplete }: LoadingScreenStripsProps) => {
    const root = useRef<HTMLDivElement | null>(null);
    const strips = useRef<(HTMLDivElement | null)[]>([]);
    const finished = useRef(false);

    useGSAP(
        () => {
            if (!root.current) return;

            const finish = () => {
                if (finished.current) return;
                finished.current = true;
                onComplete();
            };

            if (prefersReducedMotion()) {
                finish();
                return;
            }

            const targets = strips.current.filter(Boolean);
            const tl = gsap.timeline({
                onComplete: finish,
            });

            tl.to(targets, {
                y: "-100vh",
                duration: stripDuration,
                ease: "power3.inOut",
                stagger: delayPerStrip,
            });

            return () => {
                tl.kill();
            };
        },
        { dependencies: [] },
    );

    return (
        <div
            ref={root}
            className="fixed inset-0 z-[200] flex"
            aria-hidden="true"
        >
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
                    }}
                />
            ))}
        </div>
    );
};

export default LoadingScreenStrips;