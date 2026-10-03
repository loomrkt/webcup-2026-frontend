import React from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { usePageTransition } from "../../hooks/PageTransitionProvider";
import "./PageTransitionAnimation.css";
import StripTransition from "./StripTransition";
import SplitTransition from "./SlitTransition";
import StripCenterTransition from "./StripCenterTransition";
import DiagonalWipeTransition from "./DiagonalWipeTransition";
import ZoomBurstTransition from "./ZoomBurstTransition";
import GlitchSlideTransition from "./GlitchSlideTransition";

const getLoadingScreen = (selectedPath: string) => {
    switch (selectedPath) {
        case "/SquareHole":
            return <DiagonalWipeTransition />;
        case "/AreYouReady":
            return <GlitchSlideTransition />;
        case "/pixel":
            return <ZoomBurstTransition />;
        case "/StripsCenter":
            return <StripCenterTransition />;
        case "/":
            return <SplitTransition />;
        default:
            return <StripTransition />;
    }
};

const PageTransitionAnimation: React.FC = () => {
    const { isTransitioning, targetPath } = usePageTransition();
    const location = useLocation();

    // Select animation based on target path (or current path if not transitioning)
    const selectedPath =
        isTransitioning && targetPath ? targetPath : location.pathname;

    return (
        <AnimatePresence>
            {isTransitioning && getLoadingScreen(selectedPath)}
        </AnimatePresence>
    );
};

export default PageTransitionAnimation;
