import { motion } from "framer-motion";

const SplitTransition = () => {
    return (
        <motion.div className="fixed inset-0 z-50 flex">
            {/* Left curtain */}
            <motion.div
                className="h-full w-1/2 bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Right curtain */}
            <motion.div
                className="h-full w-1/2 bg-primary"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
        </motion.div>
    );
};

export default SplitTransition;
