"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FC, useRef } from "react";
import { AnimatedTextProps } from "./types";
import { useScrollDefaultOptions } from "@/helpers/constant";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface TextBlurProps extends AnimatedTextProps {
    delay?: number;
    duration?: number;
    active?: boolean;
}

const TextBlur: FC<TextBlurProps> = ({
    text,
    useScrollTrigger = true,
    as: Tag = "h1",
    delay = 0,
    duration = 1,
    active = true,
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(
        () => {
            if (!textRef.current || prefersReducedMotion() || !active) return;

            const splitter = SplitText.create(textRef.current, { type: "chars" });

            gsap.fromTo(
                splitter.chars,
                {
                    opacity: 0,
                    filter: "blur(13px)",
                    scale: 3.4,
                },
                {
                    opacity: 1,
                    delay,
                    duration,
                    filter: "blur(0px)",
                    stagger: 0.02,
                    scale: 1,
                    ease: "power4.out",
                    ...(useScrollTrigger && {
                        scrollTrigger: {
                            ...scrolOpts,
                            trigger: textRef.current,
                        },
                    }),
                },
            );

            return () => {
                splitter.revert();
            };
        },
        { dependencies: [text, delay, duration, useScrollTrigger, active] },
    );

    return (
        <Tag
            ref={(node) => {
                textRef.current = node;
            }}
            className="origin-top"
            {...props}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

export default TextBlur;