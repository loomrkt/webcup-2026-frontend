import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenStripsProps {
    onComplete: () => void;
}

const LoadingScreenStrips = ({ onComplete }: LoadingScreenStripsProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [fillScreen, setFillScreen] = useState(false);
    const stripCount = 8; // Number of vertical strips
    const fillDuration = 0.8; // Duration for strips to fill the screen
    const exitDuration = 0.8; // Duration for strips to exit
    const totalDuration = fillDuration + exitDuration + 0.3; // Total animation time
    const delayPerStrip = 0.1; // Delay between each strip's animation

    useEffect(() => {
        // Start filling the screen
        const fillTimer = setTimeout(() => {
            setFillScreen(true);
        }, 100);

        // Trigger exit animation after filling
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, totalDuration * 1000);

        return () => {
            clearTimeout(fillTimer);
            clearTimeout(exitTimer);
        };
    }, [onComplete()]);

    if (!isVisible) return null;

    const stripVariants = (index: number) => ({
        hiddenn: {
            y: 0,
        },
        visible: {
            y: "-100vh",
            transition: {
                duration: fillDuration,
                ease: "easeInOut",
                delay: index * delayPerStrip,
            },
        },
    });

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
                {Array.from({ length: stripCount }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="h-full bg-primary"
                        style={{ width: `${100 / stripCount}%` }}
                        variants={stripVariants(index)}
                        initial="hidden"
                        animate={fillScreen ? "visible" : "hidden"}
                        exit="exit"
                    />
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingScreenStrips;
