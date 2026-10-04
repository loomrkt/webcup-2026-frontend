"use client"
import { Fragment, JSX } from "react";
import useCursor from "./hooks/useCursor";

const Cursor = (): JSX.Element => {
    const { cursorRef, followerRef } = useCursor();
    return (
        <Fragment>
            <span
                id="custom-cursor"
                ref={cursorRef}
                className="pointer-events-none fixed top-0 left-0 z-500000 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#886aff] mix-blend-difference"
            ></span>

            <span
                ref={followerRef}
                className="pointer-events-none fixed top-0 left-0 z-400000 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9e85ff]"
            ></span>
        </Fragment>
    );
};

export default Cursor;