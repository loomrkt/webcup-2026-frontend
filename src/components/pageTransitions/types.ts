export interface PageTransitionProps {
    phase: "cover" | "reveal";
    onComplete?: () => void;
}