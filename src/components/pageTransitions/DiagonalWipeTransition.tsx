// import React from 'react';
// import { motion, Variants } from 'framer-motion';

// interface FlipTransitionProps {
//   className?: string;
// }

// const flipVariants: Variants = {
//   initial: {
//     scale: 1,
//     rotateY: 180,
//     opacity: 0,
//     transition: { duration: 0.6, ease: 'easeInOut' },
//   },
//   animate: {
//     scale: 1,
//     rotateY: 0,
//     opacity: 1,
//     transition: { duration: 0.6, ease: 'easeInOut' },
//   },
//   exit: {
//     scale: 1,
//     rotateY: 180,
//     opacity: 0,
//     transition: { duration: 0.6, ease: 'easeInOut' },
//   },
// };

// const FlipTransition: React.FC<FlipTransitionProps> = ({
//   className = 'fixed inset-0 z-50 bg-blue-500',
// }) => {
//   return (
//     <motion.div
//       className={className}
//       variants={flipVariants}
//       initial="initial"
//       animate="animate"
//       exit="exit"
//     />
//   );
// };

// export default FlipTransition;

import React from "react";
import { motion, Variants } from "framer-motion";

interface FillTransitionProps {
    className?: string;
}

const fillVariants: Variants = {
    initial: {
        scale: 0,
        y: "0%",
        transition: { duration: 0.5, ease: "easeInOut" },
    },
    animate: {
        scale: 4,
        transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
        scale: 0,
        transition: { duration: 0.5, ease: "easeInOut" },
    },
};

const FillTransition: React.FC<FillTransitionProps> = ({
    className = "fixed inset-0 z-50 bg-green-500",
}) => {
    return (
        <motion.div
            className={className}
            variants={fillVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                borderRadius: "100%", // Pour donner l'apparence d'un point
                position: "absolute",
                bottom: 0,
            }}
        />
    );
};

export default FillTransition;
