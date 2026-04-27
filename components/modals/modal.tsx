"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
    isOpen: boolean;
    closeCallback: () => void;
    className?: string;
}

const ANIMATION_MS = 200;

export default function Modal({
    children,
    isOpen,
    closeCallback,
    className = "",
}: PropsWithChildren<Props>) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    const mouseDownStartedOnBackdrop = useRef(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });

            return;
        }

        setIsVisible(false);

        const timeout = setTimeout(() => {
            setShouldRender(false);
        }, ANIMATION_MS);

        return () => clearTimeout(timeout);
    }, [isOpen]);

    if (!shouldRender) return null;

    return createPortal(
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center
                bg-[var(--bg-1)]/25 backdrop-blur-sm
                transition-opacity duration-200 ease-out
                ${isVisible ? "opacity-100" : "opacity-0"}
            `}
            onMouseDown={(e) => {
                mouseDownStartedOnBackdrop.current =
                    e.target === e.currentTarget;
            }}
            onMouseUp={(e) => {
                const mouseUpEndedOnBackdrop = e.target === e.currentTarget;

                if (
                    mouseDownStartedOnBackdrop.current &&
                    mouseUpEndedOnBackdrop
                ) {
                    closeCallback();
                }

                mouseDownStartedOnBackdrop.current = false;
            }}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div
                className={`
                    transition-all duration-200 ease-out
                    ${
                        isVisible
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-4"
                    }
                    ${className}
                `}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}