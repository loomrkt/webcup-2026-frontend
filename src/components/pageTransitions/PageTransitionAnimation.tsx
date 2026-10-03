"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransitionProvider";
import SlitTransition from "./SlitTransition";
import StripTransition from "./StripTransition";
import StripCenterTransition from "./StripCenterTransition";
import DiagonalWipeTransition from "./DiagonalWipeTransition";
import ZoomBurstTransition from "./ZoomBurstTransition";
import GlitchSlideTransition from "./GlitchSlideTransition";

const renderTransition = (
    path: string,
    phase: "cover" | "reveal",
    onComplete: () => void,
): React.ReactElement => {
    switch (path) {
        case "/":
            return <SlitTransition phase={phase} onComplete={onComplete} />;
        case "/login":
            return <StripTransition phase={phase} onComplete={onComplete} />;
        case "/register":
            return <StripCenterTransition phase={phase} onComplete={onComplete} />;
        case "/square-hole":
            return <DiagonalWipeTransition phase={phase} onComplete={onComplete} />;
        case "/pixel":
            return <ZoomBurstTransition phase={phase} onComplete={onComplete} />;
        case "/strips":
            return <GlitchSlideTransition phase={phase} onComplete={onComplete} />;
        default:
            return <StripTransition phase={phase} onComplete={onComplete} />;
    }
};

const PageTransitionAnimation: React.FC = () => {
    const { targetPath, completeTransition } = usePageTransition();
    const pathname = usePathname();

    const phase = pathname === targetPath ? "reveal" : "cover";
    const path = targetPath ?? pathname;

    return renderTransition(path ?? "/", phase, completeTransition);
};

export default PageTransitionAnimation;