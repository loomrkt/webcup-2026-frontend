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

interface TextFollowProps extends AnimatedTextProps {
    scrub?: boolean;
    duration?: number;
    stagger?: number;
    byLine?: boolean;
    delay?: number;
}

const TextFollow: FC<TextFollowProps> = ({
    text,
    useScrollTrigger = true,
    scrub = false,
    duration = 0.2,
    stagger = 0.15,
    className,
    delay = 0,
    byLine = false,
    as: Tag = "h1",
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(
        () => {
            if (!textRef.current || prefersReducedMotion()) return;

            const split = new SplitText(textRef.current, {
                type: byLine ? "lines" : "words",
                preserveHTMLTags: true,
            });
            const target = byLine ? split.lines : split.words;

            const tl = gsap.timeline(
                useScrollTrigger
                    ? {
                          scrollTrigger: {
                              ...scrolOpts,
                              trigger: textRef.current,
                              start: "+=55 84%",
                              end: "top 10%",
                              ...(scrub && {
                                  scrub: 1,
                              }),
                          },
                      }
                    : {},
            );

            tl.to(target, {
                backgroundPosition: "0% 0%",
                ease: "power2.inOut",
                duration,
                stagger,
                ...(!scrub && {
                    delay,
                }),
            });

            return () => {
                split.revert();
                tl.kill();
            };
        },
        { dependencies: [text, scrub, duration, stagger, byLine, useScrollTrigger] },
    );

    return (
        <Tag
            ref={(node) => {
                textRef.current = node;
            }}
            className={cn("text-follow", className)}
            {...props}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

export default TextFollow;