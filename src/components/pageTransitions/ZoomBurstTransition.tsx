import React from "react";
import { motion, Variants } from "framer-motion";

interface ZoomBurstProps {
    className?: string;
}

const zoomVariants: Variants = {
    initial: {
        scale: 0,
        rotate: -90,
        opacity: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
    animate: {
        scale: 1.5,
        rotate: 0,
        opacity: 1,
        transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
        scale: 0,
        rotate: 90,
        opacity: 0,
        transition: { duration: 0.7, ease: "easeIn" },
    },
};

const ZoomBurstTransition: React.FC<ZoomBurstProps> = ({
    className = "fixed inset-0 z-50 bg-gradient-to-br from-purple-600 to-pink-500",
}) => {
    return (
        <motion.div
            className={className}
            variants={zoomVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        />
    );
};

export default ZoomBurstTransition;
