"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import cn from "@/lib/frontend/utils/cn";
import { Button } from "@/components/ui/button";

interface Props extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className"
> {
    label?: ReactNode;
    error?: ReactNode;
    icon?: ReactNode;
    rightSlot?: ReactNode;

    className?: string; // стили контейнера input
    rootClassName?: string; // стили общего wrapper
    inputClassName?: string;
    labelClassName?: string;
    errorClassName?: string;

    showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(
    (
        {
            label,
            error,
            icon,
            rightSlot,

            id,
            name,
            type = "text",
            disabled,

            className,
            rootClassName,
            inputClassName,
            labelClassName,
            errorClassName,

            showPasswordToggle = true,

            ...props
        },
        ref,
    ) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);

        const inputId = id ?? name;
        const errorId = error && inputId ? `${inputId}-error` : undefined;

        const isPassword = type === "password";
        const shouldShowPasswordToggle = isPassword && showPasswordToggle;

        const currentType =
            shouldShowPasswordToggle && isPasswordVisible ? "text" : type;

        return (
            <div className={cn("flex flex-col gap-1.5", rootClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "text-sm font-medium text-(--text-1)",
                            labelClassName,
                        )}
                    >
                        {label}
                    </label>
                )}

                <div
                    className={cn(
                        "relative flex items-center gap-2 rounded-xl border border-(--bg-3) bg-(--bg-2) px-3 py-2 text-sm text-(--text-1)",
                        "focus-within:border-(--accent-flame-1)",
                        disabled && "cursor-not-allowed opacity-60",
                        error && "border-red-500 focus-within:border-red-500",
                        className,
                    )}
                >
                    {icon && (
                        <span className="pointer-events-none flex shrink-0 items-center text-gray-500">
                            {icon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        name={name}
                        type={currentType}
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className={cn(
                            "min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-500 disabled:cursor-not-allowed",
                            shouldShowPasswordToggle && "pr-9",
                            inputClassName,
                        )}
                        {...props}
                    />

                    {shouldShowPasswordToggle ? (
                        <Button
                            type="button"
                            variant="icon"
                            size="icon-sm"
                            disabled={disabled}
                            onClick={() =>
                                setIsPasswordVisible((value) => !value)
                            }
                            aria-label={
                                isPasswordVisible
                                    ? "Сховати пароль"
                                    : "Показати пароль"
                            }
                            aria-pressed={isPasswordVisible}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {isPasswordVisible ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </Button>
                    ) : rightSlot ? (
                        <span className="flex shrink-0 items-center">
                            {rightSlot}
                        </span>
                    ) : null}
                </div>

                {error && (
                    <p
                        id={errorId}
                        className={cn("text-xs text-red-500", errorClassName)}
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";

export default Input;
