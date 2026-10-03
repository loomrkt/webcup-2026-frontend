import React from "react";
import { motion, Variants } from "framer-motion";

interface BounceTransitionProps {
    className?: string;
}

const bounceVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 0,
        backgroundColor: "#ff007a",
        transition: { duration: 0.7, ease: "easeInOut" },
    },
    animate: {
        scale: 1,
        opacity: 1,
        backgroundColor: "#00c6ff",
        transition: {
            duration: 0.7,
            ease: [0.68, -0.55, 0.27, 1.55], // easing for bounce effect
        },
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.7, ease: "easeIn" },
    },
};

const BounceTransition: React.FC<BounceTransitionProps> = ({
    className = "fixed inset-0 z-50",
}) => {
    return (
        <motion.div
            className={className}
            variants={bounceVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        />
    );
};

export default BounceTransition;
