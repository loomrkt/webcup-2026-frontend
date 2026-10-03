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

interface TextMiddleOutProps extends AnimatedTextProps {
    delay?: number;
    duration?: number;
}

const TextMiddleOut: FC<TextMiddleOutProps> = ({
    text,
    useScrollTrigger = true,
    className,
    as: Tag = "h1",
    delay = 0.5,
    duration = 0.6,
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(
        () => {
            if (!textRef.current || prefersReducedMotion()) return;

            const splitter = SplitText.create(textRef.current);

            gsap.set(splitter.chars, {
                yPercent: 130,
                opacity: 0,
                scaleY: 0.5,
                transformOrigin: "bottom bottom",
            });

            const tl = gsap.timeline({
                delay,
                ...(useScrollTrigger && {
                    scrollTrigger: {
                        ...scrolOpts,
                        trigger: textRef.current,
                    },
                }),
            });

            tl.to(splitter.chars, {
                opacity: 1,
                yPercent: 0,
                duration,
                scaleY: 1,
                ease: "sine.out",
                stagger: {
                    amount: 0.55,
                    from: "center",
                },
            });

            return () => {
                splitter.revert();
            };
        },
        { dependencies: [text, delay, duration, useScrollTrigger] },
    );

    return (
        <Tag
            ref={(node) => {
                textRef.current = node;
            }}
            className={cn("text-middleout", className)}
            {...props}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

export default TextMiddleOut;