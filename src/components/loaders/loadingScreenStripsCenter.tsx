import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenStripsCenterProps {
    onComplete: () => void;
}

const LoadingScreenStripsCenter = ({
    onComplete,
}: LoadingScreenStripsCenterProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [startExit, setStartExit] = useState(false);

    const stripCount = 11;
    const centerIndex = Math.floor(stripCount / 2);
    const exitDelayPerStrip = 0.15;
    const exitDuration = 0.8;

    useEffect(() => {
        setStartExit(true);

        const endTimer = setTimeout(
            () => {
                setIsVisible(false);
                onComplete();
            },
            stripCount * exitDelayPerStrip * 1000,
        );

        return () => {
            clearTimeout(endTimer);
        };
    }, [onComplete()]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
                {Array.from({ length: stripCount }).map((_, index) => {
                    const delayFromCenter = Math.abs(centerIndex - index);
                    const exitDelay = delayFromCenter * exitDelayPerStrip;

                    return (
                        <div
                            key={index}
                            className="relative h-full"
                            style={{ width: `${100 / stripCount}%` }}
                        >
                            {/* Top Half */}
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-primary"
                                style={{ height: "50%" }}
                                initial={{ y: 0 }}
                                animate={
                                    startExit
                                        ? {
                                              y: "-100%",
                                              transition: {
                                                  duration: exitDuration,
                                                  ease: "easeInOut",
                                                  delay: exitDelay,
                                              },
                                          }
                                        : {}
                                }
                            />
                            {/* Bottom Half */}
                            <motion.div
                                className="absolute bottom-0 left-0 w-full bg-primary"
                                style={{ height: "50%" }}
                                initial={{ y: 0 }}
                                animate={
                                    startExit
                                        ? {
                                              y: "100%",
                                              transition: {
                                                  duration: exitDuration,
                                                  ease: "easeInOut",
                                                  delay: exitDelay,
                                              },
                                          }
                                        : {}
                                }
                            />
                        </div>
                    );
                })}
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingScreenStripsCenter;
