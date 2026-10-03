"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface LoadingSquareHoleProps {
    onComplete: () => void;
}

const LoadingSquareHole = ({ onComplete }: LoadingSquareHoleProps) => {
    const [progress, setProgress] = useState(0);
    const [viewport, setViewport] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    });
    const finished = useRef(false);

    useGSAP(
        () => {
            const finish = () => {
                if (finished.current) return;
                finished.current = true;
                onComplete();
            };

            if (prefersReducedMotion()) {
                setProgress(1);
                finish();
                return;
            }

            const state = { value: 0 };
            const tl = gsap.to(state, {
                value: 1,
                duration: 1.7,
                ease: "power2.inOut",
                onUpdate: () => setProgress(state.value),
                onComplete: finish,
            });

            return () => {
                tl.kill();
            };
        },
        { dependencies: [] },
    );

    useEffect(() => {
        const update = () =>
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    if (viewport.width === 0) return null;

    const maxSize =
        Math.sqrt(viewport.width ** 2 + viewport.height ** 2) * 2;
    const size = progress * maxSize;
    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    const skewAngle = (1 - progress) * 25;

    return (
        <div className="fixed inset-0 z-[200]" aria-hidden="true">
            <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
            >
                <defs>
                    <mask id="loadingSquareMask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <g transform={`translate(${centerX}, ${centerY})`}>
                            <rect
                                x={-size / 2}
                                y={-size / 2}
                                width={size}
                                height={size}
                                fill="black"
                                transform={`skewY(${skewAngle})`}
                            />
                        </g>
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    style={{ fill: "var(--dg-bg-raised)" }}
                    mask="url(#loadingSquareMask)"
                />
            </svg>
        </div>
    );
};

export default LoadingSquareHole;