"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import LoadingScreenAreYouReady from "./LoadingScreenAreYouReady";
import PixelLoadingScreen from "./PixelLoadingScreen";
import LoadingSquareHole from "./LoadingSquareHole";
import LoadingScreenStrips from "./LoadingScreenStrips";
import LoadingScreenStripsCenter from "./loadingScreenStripsCenter";
import { markAppLoaded } from "@/helpers/loader-events";

interface LoadingWrapperProps {
    children: React.ReactNode;
}

const renderLoader = (
    path: string,
    onComplete: () => void,
): React.ReactElement => {
    switch (path) {
        case "/login":
            return <LoadingScreenAreYouReady onComplete={onComplete} />;
        case "/register":
            return <LoadingScreenStripsCenter onComplete={onComplete} />;
        case "/pixel":
            return <PixelLoadingScreen onComplete={onComplete} />;
        case "/square-hole":
            return <LoadingSquareHole onComplete={onComplete} />;
        case "/strips":
            return <LoadingScreenStrips onComplete={onComplete} />;
        default:
            return <LoadingScreenAreYouReady onComplete={onComplete} />;
    }
};

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
    const pathname = usePathname();
    const [initialPath] = useState(() => pathname);
    const [active, setActive] = useState(true);

    if (!active) {
        return <>{children}</>;
    }

    return (
        <>
            {renderLoader(initialPath, () => {
                markAppLoaded();
                setActive(false);
            })}
            {children}
        </>
    );
};

export default LoadingWrapper;