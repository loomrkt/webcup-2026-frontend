"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreenAreYouReady from "./LoadingScreenAreYouReady";
import PixelLoadingScreen from "./PixelLoadingScreen";
import LoadingSquareHole from "./LoadingSquareHole";
import LoadingScreenStrips from "./LoadingScreenStrips";
import LoadingScreenStripsCenter from "./loadingScreenStripsCenter";
import { LOADER_SHOWN_KEY, markAppLoaded } from "@/helpers/loader-events";

interface LoadingWrapperProps {
    children: React.ReactNode;
}

const LOADER_SKIP_PATHS = ["/verify-email"];

const noopSubscribe = (): (() => void) => () => {};

const getLoaderAlreadyShown = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
        return window.sessionStorage.getItem(LOADER_SHOWN_KEY) === "1";
    } catch {
        return false;
    }
};

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
    const loaderAlreadyShown = useSyncExternalStore(
        noopSubscribe,
        getLoaderAlreadyShown,
        () => false,
    );
    const skipLoader = loaderAlreadyShown || LOADER_SKIP_PATHS.includes(pathname);

    useEffect(() => {
        if (skipLoader) {
            markAppLoaded();
        }
    }, [skipLoader]);

    if (skipLoader || !active) {
        return <>{children}</>;
    }

    return (
        <>
            {renderLoader(initialPath, () => {
                try {
                    window.sessionStorage.setItem(LOADER_SHOWN_KEY, "1");
                } catch {
                    // ignore
                }
                markAppLoaded();
                setActive(false);
            })}
            {children}
        </>
    );
};

export default LoadingWrapper;