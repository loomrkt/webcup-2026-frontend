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

interface TextStretchProps extends AnimatedTextProps {
    delay?: number;
    duration?: number;
}

const TextStretch: FC<TextStretchProps> = ({
    text,
    useScrollTrigger = true,
    className,
    as: Tag = "h1",
    delay = 0.2,
    duration = 0.7,
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(
        () => {
            if (!textRef.current || prefersReducedMotion()) return;

            const splitWords = SplitText.create(textRef.current, {
                type: "words",
            });

            splitWords.words.forEach((word) => {
                const splitChars = SplitText.create(word, { type: "chars" });

                gsap.set(splitChars.chars, {
                    opacity: 0,
                    scaleY: 0,
                    transformOrigin: "bottom bottom",
                });

                gsap.to(splitChars.chars, {
                    opacity: 1,
                    delay,
                    duration,
                    scaleY: 1,
                    ease: "sine.out",
                    stagger: {
                        amount: 0.85,
                        from: "center",
                    },
                    ...(useScrollTrigger && {
                        scrollTrigger: {
                            ...scrolOpts,
                            trigger: textRef.current,
                        },
                    }),
                });
            });

            return () => {
                splitWords.revert();
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

export default TextStretch;