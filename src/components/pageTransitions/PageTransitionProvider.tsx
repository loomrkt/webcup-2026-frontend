import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PageTransitionContextType {
    isTransitioning: boolean;
    targetPath: string | null;
    startTransition: (path: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
    isTransitioning: false,
    targetPath: null,
    startTransition: () => {},
});

export const PageTransitionProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [targetPath, setTargetPath] = useState<string | null>(null);
    const navigate = useNavigate();

    const startTransition = (path: string) => {
        setIsTransitioning(true);
        setTargetPath(path);
        setTimeout(() => {
            navigate(path);
            setIsTransitioning(false);
            setTargetPath(null);
        }, 1000);
    };

    return (
        <PageTransitionContext.Provider
            value={{ isTransitioning, targetPath, startTransition }}
        >
            {children}
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
