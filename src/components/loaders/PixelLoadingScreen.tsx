import { useEffect, useState } from "react";

interface LoadingScreenPixelProps {
    onComplete: () => void;
}

const pixelSize = window.innerWidth / 20;
const loaderDuration = 4000;
const initialDelay = 500;

const LoadingScreenPixel = ({ onComplete }: LoadingScreenPixelProps) => {
    const [pixels, setPixels] = useState<number[]>([]);
    const [hiddenPixels, setHiddenPixels] = useState<Set<number>>(new Set());
    const [startAnimation, setStartAnimation] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const cols = Math.ceil(window.innerWidth / pixelSize);
        const rows = Math.ceil(window.innerHeight / pixelSize);
        const total = rows * cols;
        const pixelArray = Array.from({ length: total }, (_, i) => i);
        setPixels(pixelArray);

        const delayTimer = setTimeout(() => {
            setStartAnimation(true);
        }, initialDelay);

        const pixelsToHide = [...pixelArray];
        const hidden = new Set<number>();

        const interval = setInterval(() => {
            if (pixelsToHide.length === 0) {
                clearInterval(interval);
                onComplete();
                setIsVisible(false);
                return;
            }

            if (startAnimation) {
                for (let i = 0; i < 20 && pixelsToHide.length > 0; i++) {
                    const index = Math.floor(
                        Math.random() * pixelsToHide.length,
                    );
                    const pixel = pixelsToHide.splice(index, 1)[0];
                    hidden.add(pixel);
                }
                setHiddenPixels(new Set(hidden));
            }
        }, loaderDuration / 60);

        return () => {
            clearTimeout(delayTimer);
            clearInterval(interval);
        };
    }, [onComplete, startAnimation]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, ${pixelSize}px)`,
                gridTemplateRows: `repeat(auto-fill, ${pixelSize}px)`,
                gap: 0,
                width: "100vw",
                height: "100vh",
            }}
        >
            {pixels.map((pixel) => (
                <div
                    key={pixel}
                    className={`bg-primary transition-opacity duration-400 ease-out ${
                        hiddenPixels.has(pixel) ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ width: pixelSize, height: pixelSize }}
                />
            ))}
        </div>
    );
};

export default LoadingScreenPixel;
