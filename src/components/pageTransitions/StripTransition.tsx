import React from "react";
import { motion, Variants } from "framer-motion";

const stripVariants = (index: number): Variants => ({
    initial: {
        y: "-100vh",
        transition: { duration: 0.5, delay: index * 0.1 },
    },
    animate: {
        y: 0,
        transition: { duration: 0.5, delay: index * 0.1 },
    },
    exit: {
        y: "100vh",
        transition: { duration: 0.5, delay: index * 0.1 },
    },
});

interface StripTransitionProps {
    className?: string;
    stripClassName?: string;
    exitDuration?: number;
}

const StripTransition: React.FC<StripTransitionProps> = ({
    className = "fixed inset-0 z-50 flex",
    stripClassName = "h-full bg-primary",
}) => {
    return (
        <motion.div className={className}>
            {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                    key={index}
                    className={stripClassName}
                    style={{ width: `${100 / 5}%` }}
                    variants={stripVariants(index)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                />
            ))}
        </motion.div>
    );
};

export default StripTransition;
