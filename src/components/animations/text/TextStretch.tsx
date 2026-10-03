import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FC, useRef } from "react";
import { AnimatedTextProps } from "./types";
import { useScrollDefaultOptions } from "@/helpers/constant";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TextStretch: FC<AnimatedTextProps> = ({
    text,
    useScrollTrigger = true,
    className,
    as: Tag = "h1",
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(() => {
        if (!textRef.current) return;

        const splitWords = SplitText.create(textRef.current, { type: "words" });

        splitWords.words.forEach((word) => {
            const splitWords = SplitText.create(word, { type: "chars" });

            gsap.set(splitWords.chars, {
                opacity: 0,
                scaleY: 0,
                transformOrigin: "bottom bottom",
            });

            gsap.to(splitWords.chars, {
                opacity: 1,
                delay: 0.2,
                duration: 0.7,
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
                // onComplete(() => tl.reverse())
            });
        });
    }, [text]);

    return (
        <Tag
            ref={textRef}
            className={cn("text-middleout", className)}
            {...props}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

export default TextStretch;
