"use client";

import { createContext, useContext, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/gsap";
import PageTransitionAnimation from "./PageTransitionAnimation";

const COVER_DURATION_MS = 800;
const FALLBACK_DURATION_MS = 5000;

interface PageTransitionContextType {
    isTransitioning: boolean;
    targetPath: string | null;
    startTransition: (path: string) => void;
    completeTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(
    null,
);

export const PageTransitionProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [targetPath, setTargetPath] = useState<string | null>(null);
    const navigating = useRef(false);

    const startTransition = (path: string) => {
        if (navigating.current) return;
        if (path === pathname) return;
        navigating.current = true;
        setTargetPath(path);
        setIsTransitioning(true);

        const delay = prefersReducedMotion() ? 0 : COVER_DURATION_MS;
        setTimeout(() => {
            router.push(path);
        }, delay);

        setTimeout(() => {
            if (!navigating.current) return;
            navigating.current = false;
            setIsTransitioning(false);
            setTargetPath(null);
        }, FALLBACK_DURATION_MS);
    };

    const completeTransition = () => {
        navigating.current = false;
        setIsTransitioning(false);
        setTargetPath(null);
    };

    return (
        <PageTransitionContext.Provider
            value={{
                isTransitioning,
                targetPath,
                startTransition,
                completeTransition,
            }}
        >
            {children}
            {isTransitioning && <PageTransitionAnimation />}
        </PageTransitionContext.Provider>
    );
};

export const usePageTransition = () => {
    const context = useContext(PageTransitionContext);
    if (context === null) {
        throw new Error(
            "usePageTransition must be used within a PageTransitionProvider",
        );
    }
    return context;
};