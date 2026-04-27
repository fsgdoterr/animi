"use client";

import { useForm } from "react-hook-form";
import { Lock, Mail, UserRound } from "lucide-react";
import { useSignupMutation } from "@/lib/frontend/store/api/auth-api";
import { getApiErrorMessage } from "@/lib/frontend/utils/api-error";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
    onSuccess?: () => void;
}

interface RegisterFormValues {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [signup, { isLoading }] = useSignupMutation();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const isDisabled = isLoading || isSubmitting;
    const password = watch("password");

    const onSubmit = async (values: RegisterFormValues) => {
        clearErrors("root");

        try {
            await signup(values).unwrap();
            onSuccess?.();
        } catch (error) {
            setError("root", {
                message: getApiErrorMessage(error, "Не вдалося створити акаунт"),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                id="register-email"
                type="email"
                autoComplete="email"
                disabled={isDisabled}
                label="Email"
                placeholder="example@mail.com"
                icon={<Mail size={18} />}
                error={errors.email?.message}
                {...register("email", {
                    required: "Введіть пошту",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Невірний формат пошти",
                    },
                })}
            />

            <Input
                id="register-username"
                type="text"
                autoComplete="username"
                disabled={isDisabled}
                label="Ім'я користувача"
                placeholder="Ваш нікнейм"
                icon={<UserRound size={18} />}
                error={errors.username?.message}
                {...register("username", {
                    required: "Введіть ім'я користувача",
                    minLength: {
                        value: 3,
                        message: "Ім'я користувача має бути не менше 3 символів",
                    },
                    maxLength: {
                        value: 30,
                        message: "Ім'я користувача занадто довге",
                    },
                })}
            />

            <Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                disabled={isDisabled}
                label="Пароль"
                placeholder="Мінімум 6 символів"
                icon={<Lock size={18} />}
                error={errors.password?.message}
                {...register("password", {
                    required: "Введіть пароль",
                    minLength: {
                        value: 6,
                        message: "Пароль має бути не менше 6 символів",
                    },
                })}
            />

            <Input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                disabled={isDisabled}
                label="Підтвердження пароля"
                placeholder="Повторіть пароль"
                icon={<Lock size={18} />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                    required: "Повторіть пароль",
                    validate: (value) => value === password || "Паролі не збігаються",
                })}
            />

            {errors.root?.message && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    {errors.root.message}
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
                Створити акаунт
            </Button>
        </form>
    );
}