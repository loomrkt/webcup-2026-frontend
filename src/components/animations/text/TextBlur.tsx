import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FC, useRef } from "react";
import { AnimatedTextProps } from "./types";
import { useScrollDefaultOptions } from "@/helpers/constant";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TextBlur: FC<AnimatedTextProps> = ({
    text,
    useScrollTrigger = true,
    as: Tag = "h1",
    ...props
}) => {
    const textRef = useRef<HTMLElement | null>(null);
    const scrolOpts = useScrollDefaultOptions();

    useGSAP(() => {
        if (!textRef.current) return;

        const splitter = SplitText.create(textRef.current);

        gsap.fromTo(
            splitter.chars,
            {
                opacity: 0,
                filter: "blur(13px)",
                scale: 3.4,
            },
            {
                opacity: 1,
                duration: 1,
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
    }, [text]);

    return (
        <Tag
            ref={textRef}
            className="origin-top"
            {...props}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

export default TextBlur;
