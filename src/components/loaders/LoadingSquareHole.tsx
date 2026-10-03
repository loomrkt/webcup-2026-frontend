import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingSquareHoleProps {
    onComplete: () => void;
}

const LoadingSquareHole = ({ onComplete }: LoadingSquareHoleProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const start = performance.now();

            const animate = (time: number) => {
                const elapsed = (time - start) / 1000; // 2 seconds
                const rawProgress = Math.min(elapsed, 1);
                // Apply sine-based easing to slow down around 0.5
                const easedProgress =
                    Math.sin(rawProgress * Math.PI * 0.5) ** 2; // Slows down near middle
                setProgress(easedProgress);

                if (rawProgress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(() => {
                        setIsVisible(false);
                        onComplete();
                    }, 300);
                }
            };

            requestAnimationFrame(animate);
        }, 300);

        return () => clearTimeout(timeout);
    }, [onComplete()]);

    if (!isVisible) return null;

    // Size of the square (up to 200% of the diagonal to fully cover the screen)
    const maxSize =
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 2;
    const size = progress * maxSize;

    // Center of the square
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Skew to simulate perspective
    const skewAngle = (1 - progress) * 25; // Decreases progressively

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <svg
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                >
                    <defs>
                        <mask id="squareMask">
                            {/* White mask (full) */}
                            <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="white"
                            />
                            {/* Black masking square, centered */}
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

                    {/* Background with mask */}
                    <rect
                        width="100%"
                        height="100%"
                        className="fill-primary"
                        mask="url(#squareMask)"
                    />
                </svg>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingSquareHole;
