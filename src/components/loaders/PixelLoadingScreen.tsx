"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingScreenPixelProps {
    onComplete: () => void;
}

const cellSize = 44;

const LoadingScreenPixel = ({ onComplete }: LoadingScreenPixelProps) => {
    const [pixels] = useState<number[]>(() => {
        if (typeof window === "undefined") return [];
        const cols = Math.max(1, Math.ceil(window.innerWidth / cellSize));
        const rows = Math.max(1, Math.ceil(window.innerHeight / cellSize));
        return Array.from({ length: cols * rows }, (_, i) => i);
    });
    const [hiddenPixels, setHiddenPixels] = useState<Set<number>>(new Set());
    const [isVisible, setIsVisible] = useState(true);
    const finished = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        const cols = Math.max(1, Math.ceil(window.innerWidth / cellSize));
        const rows = Math.max(1, Math.ceil(window.innerHeight / cellSize));
        const remaining = Array.from(
            { length: cols * rows },
            (_, i) => i,
        );
        const hidden = new Set<number>();

        const finish = () => {
            if (finished.current) return;
            finished.current = true;
            setIsVisible(false);
            onCompleteRef.current();
        };

        const interval = window.setInterval(() => {
            if (remaining.length === 0) {
                window.clearInterval(interval);
                finish();
                return;
            }

            const batch = Math.min(22, remaining.length);
            for (let i = 0; i < batch; i++) {
                const index = Math.floor(Math.random() * remaining.length);
                hidden.add(remaining.splice(index, 1)[0]);
            }
            setHiddenPixels(new Set(hidden));
        }, 34);

        return () => window.clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, ${cellSize}px)`,
                gap: 0,
                width: "100vw",
                height: "100vh",
                background: "var(--dg-bg-raised)",
            }}
            aria-hidden="true"
        >
            {pixels.map((pixel) => (
                <div
                    key={pixel}
                    className={`transition-opacity duration-200 ease-out ${
                        hiddenPixels.has(pixel) ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                        width: cellSize,
                        height: cellSize,
                        background: "var(--dg-bg-raised)",
                    }}
                />
            ))}
        </div>
    );
};

export default LoadingScreenPixel;