"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock, UserRound } from "lucide-react";
import { useSigninMutation } from "@/lib/frontend/store/api/auth-api";
import { getApiErrorMessage } from "@/lib/frontend/utils/api-error";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
    onSuccess?: () => void;
}

interface AuthFormValues {
    username: string;
    password: string;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
    const [signin, { isLoading }] = useSigninMutation();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AuthFormValues>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const isDisabled = isLoading || isSubmitting;

    const onSubmit = async (values: AuthFormValues) => {
        setServerError("");

        try {
            await signin(values).unwrap();
            onSuccess?.();
        } catch (error) {
            setServerError(getApiErrorMessage(error, "Не вдалося увійти в акаунт"));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                id="auth-username"
                type="text"
                autoComplete="username"
                disabled={isDisabled}
                label="Email або ім'я користувача"
                placeholder="example@mail.com або username"
                icon={<UserRound size={18} />}
                error={errors.username?.message}
                {...register("username", {
                    required: "Введіть email або ім'я користувача",
                })}
            />
            <Input
                id="auth-password"
                type="password"
                autoComplete="current-password"
                disabled={isDisabled}
                label="Пароль"
                placeholder="Ваш пароль"
                icon={<Lock size={18} />}
                error={errors.password?.message}
                {...register("password", {
                    required: "Введіть пароль",
                })}
            />

            {serverError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    {serverError}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isDisabled}
                className="mt-1"
            >
                Увійти
            </Button>
        </form>
    );
}
