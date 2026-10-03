import * as React from "react";

export type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface AnimatedTextProps
    extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    useScrollTrigger?: boolean;
    scrollTriggerOpt?: {
        trigger: React.RefObject<HTMLElement>;
    };
    as?: TextTag;
}