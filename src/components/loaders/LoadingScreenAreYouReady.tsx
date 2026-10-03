import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreenAreYouReady = () => {
    const [showText, setShowText] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hideContent, setHideContent] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const syllables = ["Are&nbsp;", "you&nbsp;", "rea", "dy?"];
    const progressDuration = 0.5;
    const pauseDuration = 1;
    const contentExitDuration = 0.3;
    const panelExitDuration = 1;
    const syllableDuration = progressDuration / syllables.length;

    const syllableVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * syllableDuration,
                duration: syllableDuration,
                ease: "easeOut",
            },
        }),
        exit: (i: number) => ({
            y: -100,
            opacity: 0,
            transition: {
                delay: (i * contentExitDuration) / syllables.length,
                duration: contentExitDuration,
                ease: "easeInOut",
            },
        }),
    };

    const panelVariants = {
        initial: { y: 0 },
        exit: {
            y: "-100vh",
            transition: { duration: panelExitDuration, ease: "easeInOut" },
        },
    };

    const progressContainerVariants = {
        initial: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: contentExitDuration } },
    };

    useEffect(() => {
        setShowText(true);

        const contentTimer = setTimeout(
            () => {
                setHideContent(true);
            },
            (progressDuration + pauseDuration) * 1000,
        );

        const completeTimer = setTimeout(
            () => {
                setIsComplete(true);
                setTimeout(() => {
                    setIsVisible(false);
                }, panelExitDuration * 1000);
            },
            (progressDuration + pauseDuration + contentExitDuration) * 1000,
        );

        return () => {
            clearTimeout(contentTimer);
            clearTimeout(completeTimer);
        };
    }, []);
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
                    variants={panelVariants}
                    initial="initial"
                    exit="exit"
                >
                    <AnimatePresence>
                        {!hideContent && (
                            <div className="text-center">
                                {showText && (
                                    <div className="mb-4 flex justify-center overflow-hidden">
                                        {syllables.map((syllable, index) => (
                                            <motion.span
                                                key={index}
                                                className="font-zektonbo text-4xl leading-snug font-bold text-white md:text-7xl"
                                                custom={index}
                                                variants={syllableVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                dangerouslySetInnerHTML={{
                                                    __html: syllable,
                                                }} // Utiliser dangerouslySetInnerHTML pour afficher les entités HTML
                                            />
                                        ))}
                                    </div>
                                )}
                                <motion.div
                                    className="w-full"
                                    variants={progressContainerVariants}
                                    initial="initial"
                                    exit="exit"
                                >
                                    <div className="h-1 w-full rounded bg-gray-300">
                                        <motion.div
                                            className="h-full rounded bg-white"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{
                                                duration: progressDuration,
                                                ease: "linear",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreenAreYouReady;
