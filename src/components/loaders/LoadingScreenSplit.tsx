import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenSplitProps {
    onComplete: () => void;
}

const LoadingScreenSplit = ({ onComplete }: LoadingScreenSplitProps) => {
    const durationVertical = 1;
    const durationHorizontal = 1;
    const totalDuration = durationVertical + durationHorizontal;

    const [showVertical, setShowVertical] = useState(true);
    const [showHorizontal, setShowHorizontal] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const lineVariants = {
        hidden: { height: 0 },
        visible: {
            height: "100vh",
            transition: { duration: durationVertical, ease: "easeInOut" },
        },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    const leftPanelVariants = {
        initial: { x: 0 },
        animate: {
            x: "-100vw",
            transition: { duration: durationHorizontal, ease: "easeInOut" },
        },
        exit: {
            opacity: 0,
            x: "-100vw",
            transition: { duration: 0.3 },
        },
    };

    const rightPanelVariants = {
        initial: { x: 0 },
        animate: {
            x: "100vw",
            transition: { duration: durationHorizontal, ease: "easeInOut" },
        },
        exit: {
            opacity: 0,
            x: "100vw",
            transition: { duration: 0.3 },
        },
    };

    useEffect(() => {
        const verticalTimer = setTimeout(() => {
            setShowVertical(false);
            setShowHorizontal(true);
        }, durationVertical * 1000);

        const horizontalTimer = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, totalDuration * 1000);

        return () => {
            clearTimeout(verticalTimer);
            clearTimeout(horizontalTimer);
        };
    }, [onComplete()]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
                <div className="absolute inset-0 flex">
                    <motion.div
                        className="h-full w-1/2 bg-primary"
                        variants={leftPanelVariants}
                        initial="initial"
                        animate={showHorizontal ? "animate" : "initial"}
                        exit="exit"
                    />
                    <motion.div
                        className="h-full w-1/2 bg-primary"
                        variants={rightPanelVariants}
                        initial="initial"
                        animate={showHorizontal ? "animate" : "initial"}
                        exit="exit"
                    />
                </div>
                {showVertical && (
                    <motion.div
                        className="z-10 w-1 bg-white"
                        variants={lineVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingScreenSplit;
