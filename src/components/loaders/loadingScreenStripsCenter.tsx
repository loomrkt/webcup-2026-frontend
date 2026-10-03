"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface LoadingScreenStripsCenterProps {
    onComplete: () => void;
}

const stripCount = 11;
const centerIndex = Math.floor(stripCount / 2);
const delayPerStrip = 0.12;
const exitDuration = 0.85;

const LoadingScreenStripsCenter = ({
    onComplete,
}: LoadingScreenStripsCenterProps) => {
    const halves = useRef<(HTMLDivElement | null)[]>([]);
    const finished = useRef(false);

    useGSAP(
        () => {
            const finish = () => {
                if (finished.current) return;
                finished.current = true;
                onComplete();
            };

            if (prefersReducedMotion()) {
                finish();
                return;
            }

            const targets = halves.current.filter(
                (el) => el !== null,
            ) as HTMLDivElement[];
            const tl = gsap.timeline({
                onComplete: finish,
            });

            targets.forEach((el) => {
                const isTop = el.dataset.half === "top";
                tl.to(
                    el,
                    {
                        y: isTop ? "-100%" : "100%",
                        duration: exitDuration,
                        ease: "power3.inOut",
                        delay: Math.abs(Number(el.dataset.index) - centerIndex) *
                            delayPerStrip,
                    },
                    0,
                );
            });

            return () => {
                tl.kill();
            };
        },
        { dependencies: [] },
    );

    return (
        <div className="fixed inset-0 z-[200] flex" aria-hidden="true">
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
                        style={{ background: "var(--dg-bg-raised)" }}
                    />
                    <div
                        ref={(el) => {
                            halves.current[index * 2 + 1] = el;
                        }}
                        data-half="bottom"
                        data-index={index}
                        className="absolute inset-x-0 bottom-0 h-1/2"
                        style={{ background: "var(--dg-bg)" }}
                    />
                </div>
            ))}
        </div>
    );
};

export default LoadingScreenStripsCenter;