"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface LoadingScreenAreYouReadyProps {
    onComplete: () => void;
}

const syllables = ["Are", "you", "rea", "dy?"];

const LoadingScreenAreYouReady = ({
    onComplete,
}: LoadingScreenAreYouReadyProps) => {
    const panel = useRef<HTMLDivElement | null>(null);
    const content = useRef<HTMLDivElement | null>(null);
    const bar = useRef<HTMLDivElement | null>(null);
    const text = useRef<HTMLParagraphElement | null>(null);
    const finished = useRef(false);

    useGSAP(
        () => {
            if (!panel.current || !bar.current || !content.current || !text.current)
                return;

            const finish = () => {
                if (finished.current) return;
                finished.current = true;
                onComplete();
            };

            if (prefersReducedMotion()) {
                finish();
                return;
            }

            const tl = gsap.timeline({
                onComplete: finish,
            });

            tl.fromTo(
                text.current.querySelectorAll("span"),
                { y: 54, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.45,
                    ease: "power3.out",
                    stagger: 0.14,
                },
                0.15,
            )
                .fromTo(
                    bar.current,
                    { width: "0%" },
                    {
                        width: "100%",
                        duration: 0.55,
                        ease: "power1.inOut",
                    },
                    0.25,
                )
                .to(content.current, {
                    opacity: 0,
                    y: -24,
                    duration: 0.3,
                    ease: "power2.in",
                })
                .to(panel.current, {
                    y: "-100%",
                    duration: 1,
                    ease: "power3.inOut",
                }, "+=0.25");

            return () => {
                tl.kill();
            };
        },
        { dependencies: [] },
    );

    return (
        <div
            ref={panel}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ background: "var(--dg-bg)" }}
            aria-hidden="true"
        >
            <div ref={content} className="relative flex flex-col items-center">
                <div
                    className="mb-6 rounded-full border border-[var(--dg-border)] bg-white/[0.04] px-4 py-1.5 text-xs text-[var(--dg-text-muted)]"
                >
                    TERRA&nbsp;NOVA
                </div>
                <p
                    ref={text}
                    className="text-4xl font-bold leading-snug text-white md:text-6xl"
                >
                    {syllables.map((syllable, index) => (
                        <span
                            key={index}
                            className={index === syllables.length - 1
                                ? "text-[var(--dg-accent-bright)]"
                                : "text-white"}
                        >
                            {syllable}
                            {index < syllables.length - 1 ? "\u00A0" : ""}
                        </span>
                    ))}
                </p>
                <div className="mt-10 h-1 w-64 overflow-hidden rounded-full bg-white/10">
                    <div
                        ref={bar}
                        className="h-full rounded-full"
                        style={{
                            background:
                                "linear-gradient(to right, var(--dg-accent-bright), var(--dg-accent))",
                            boxShadow: "0 0 16px var(--dg-accent-glow)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreenAreYouReady;