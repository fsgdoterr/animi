import { RefObject, useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
    enabled?: boolean;
    root?: Element | null;
    rootMargin?: string;
    threshold?: number;
}

export function useIntersectionObserver({
    enabled = true,
    root = null,
    rootMargin = "0px",
    threshold = 0,
}: UseIntersectionObserverOptions) {
    const ref = useRef<HTMLDivElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const target = ref.current;

        if (!target || !enabled) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                } else {
                    setIsIntersecting(false);
                }
            },
            {
                root,
                rootMargin,
                threshold,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [
        ref,
        enabled,
        root,
        rootMargin,
        threshold,
    ]);

    return { ref, isIntersecting };
}