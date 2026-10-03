export const LOADED_EVENT = "dg:loaded";

export const LOADER_SHOWN_KEY = "dg:loader-shown";

export const isAppLoaded = (): boolean =>
    typeof window !== "undefined" && window.__dgAppLoaded === true;

export const markAppLoaded = (): void => {
    if (typeof window === "undefined") return;
    window.__dgAppLoaded = true;
    window.dispatchEvent(new Event(LOADED_EVENT));
};

export const onAppLoaded = (callback: () => void): (() => void) => {
    if (isAppLoaded()) {
        callback();
        return () => {};
    }

    const handler = () => {
        callback();
        window.removeEventListener(LOADED_EVENT, handler);
    };
    window.addEventListener(LOADED_EVENT, handler);
    return () => window.removeEventListener(LOADED_EVENT, handler);
};