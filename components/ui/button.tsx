"use client";

import Link, { type LinkProps } from "next/link";
import { Loader2 } from "lucide-react";
import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
} from "react";
import cn from "@/lib/frontend/utils/cn";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "text"
    | "icon";

type ButtonSize =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "icon-sm"
    | "icon-md";

type CommonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    loadingIcon?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
    children?: ReactNode;
};

type NativeButtonProps = CommonProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
        href?: never;
    };

type LinkButtonProps = CommonProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> &
    Pick<LinkProps, "href" | "replace" | "scroll" | "prefetch" | "shallow" | "locale"> & {
        disabled?: boolean;
        type?: never;
    };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const baseClass =
    "inline-flex shrink-0 items-center justify-center gap-2 transition cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--flame-1)/40 " +
    "disabled:cursor-not-allowed disabled:opacity-60 " +
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "rounded-xl bg-(--flame-1) text-sm font-semibold text-white hover:bg-(--flame-2)",

    secondary:
        "rounded-xl border border-(--bg-4) bg-(--bg-2) text-sm font-semibold text-(--text-1) hover:bg-(--bg-3)",

    danger:
        "rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-500 hover:bg-red-500/20",

    ghost:
        "rounded-lg text-(--text-1) hover:bg-(--bg-3)",

    text:
        "rounded-none p-0 text-(--flame-1) hover:underline",

    icon:
        "rounded-md text-gray-500 hover:text-(--text-1)",
};

const sizeClasses: Record<ButtonSize, string> = {
    xs: "px-3 py-2 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-4 py-3 text-sm",

    "icon-sm": "size-8 p-0",
    "icon-md": "size-10 p-0",
};

const loaderSize: Record<ButtonSize, number> = {
    xs: 15,
    sm: 16,
    md: 16,
    lg: 18,
    "icon-sm": 16,
    "icon-md": 18,
};

export function Button(props: ButtonProps) {
    const {
        variant = "secondary",
        size = "md",
        fullWidth = false,
        loading = false,
        loadingIcon,
        leftIcon,
        rightIcon,
        className,
        children,
        disabled,
        ...rest
    } = props;

    const isDisabled = Boolean(disabled || loading);

    const content = (
        <>
            {loading
                ? loadingIcon ?? (
                    <Loader2
                        size={loaderSize[size]}
                        className="animate-spin"
                    />
                )
                : leftIcon}

            {children}

            {!loading && rightIcon}
        </>
    );

    const finalClassName = cn(
        baseClass,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
    );

    if ("href" in props && props.href) {
        const {
            href,
            replace,
            scroll,
            prefetch,
            shallow,
            locale,
            onClick,
            ...linkRest
        } = rest as Omit<LinkButtonProps, keyof CommonProps | "disabled">;

        return (
            <Link
                href={href}
                replace={replace}
                scroll={scroll}
                prefetch={prefetch}
                shallow={shallow}
                locale={locale}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : undefined}
                className={finalClassName}
                onClick={(event) => {
                    if (isDisabled) {
                        event.preventDefault();
                        return;
                    }

                    onClick?.(event);
                }}
                {...linkRest}
            >
                {content}
            </Link>
        );
    }

    const { type = "button", ...buttonRest } =
        rest as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
        <button
            type={type}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className={finalClassName}
            {...buttonRest}
        >
            {content}
        </button>
    );
}