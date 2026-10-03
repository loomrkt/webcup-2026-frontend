"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FC, useRef } from "react";
import { AnimatedTextProps } from "./types";
import { useScrollDefaultOptions } from "@/helpers/constant";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface TextFadeProps extends AnimatedTextProps {
    single?: boolean;
    delay?: number;
    duration?: number;
}

const TextFade: FC<TextFadeProps> = ({
    text,
    useScrollTrigger = true,
    as: Tag = "h1",
    className,
    single = false,
    delay = 0.14,
    duration,
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(
        () => {
            if (!textRef.current || prefersReducedMotion()) return;

            const splitter = SplitText.create(textRef.current);
            const splittedText = single ? splitter.chars : splitter.words;

            gsap.set(splittedText, {
                y: 90,
                opacity: 0,
                overflow: "hidden",
                height: "max-content",
            });

            gsap.to(splittedText, {
                opacity: 1,
                delay,
                duration: duration ?? (single ? 0.5 : 1.6),
                y: 0,
                stagger: 0.03,
                rotateX: 0,
                ease: "elastic(1.2, 0.5)",
                ...(useScrollTrigger && {
                    scrollTrigger: {
                        ...scrolOpts,
                        trigger: textRef.current,
                    },
                }),
            });

            return () => {
                splitter.revert();
            };
        },
        { dependencies: [text, single, delay, duration, useScrollTrigger] },
    );

    return (
        <Tag
            ref={(node) => {
                textRef.current = node;
            }}
            className={cn("fade-text", className)}
            {...props}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

export default TextFade;