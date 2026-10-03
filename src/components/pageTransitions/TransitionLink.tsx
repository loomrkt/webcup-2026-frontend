"use client";

import Link from "next/link";
import { usePageTransition } from "./PageTransitionProvider";

interface TransitionLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    id?: string;
    "aria-label"?: string;
    title?: string;
}

const TransitionLink: React.FC<TransitionLinkProps> = ({
    href,
    onClick,
    ...props
}) => {
    const { startTransition } = usePageTransition();
    const internal =
        href.startsWith("/") &&
        !href.startsWith("#") &&
        !href.startsWith("//") &&
        !href.startsWith("http");

    return (
        <Link
            {...props}
            href={href}
            onClick={(event) => {
                onClick?.(event);
                if (
                    internal &&
                    !event.defaultPrevented &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                ) {
                    event.preventDefault();
                    startTransition(href);
                }
            }}
        />
    );
};

export default TransitionLink;