"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import { useCreateUserMutation } from "@/lib/frontend/store/api/users-api";

interface IFormValues {
    username: string;
    email: string;
    password: string;
}

export default function CreateUserForm() {
    const [isHidden, setIsHidden] = useState(true);
    const [createUser] = useCreateUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IFormValues>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        try {
            await createUser(data).unwrap();
            reset({ username: "", email: "", password: "" });
        } catch (e) {
            console.error("Create user error", e);
        }
    };

    const errMessages = Object.values(errors).map((err) => err.message);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={clsx("flex flex-col", !isHidden && "gap-2")}
        >
            <div className="relative z-10 flex items-center gap-2">
                <h3 className="text-2xl">Створити нового користувача</h3>

                <Button
                    type="button"
                    variant="text"
                    onClick={() => setIsHidden((prev) => !prev)}
                >
                    {isHidden ? "Показати" : "Приховати"}
                </Button>
            </div>

            <div
                className={clsx(
                    "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-in-out",
                    isHidden && "max-h-0 opacity-0 -translate-y-4",
                    !isHidden && "max-h-96 opacity-100 translate-y-0",
                )}
            >
                <div className="flex flex-col gap-2 pt-2">
                    <div className="flex gap-4 items-end">
                        <Input
                            label="Імʼя користувача"
                            placeholder="Введіть імʼя користувача"
                            error={!!errors.username?.message}
                            {...register("username", {
                                required: "Введіть ім'я користувача",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Ім'я користувача має бути не менше 3 символів",
                                },
                                maxLength: {
                                    value: 30,
                                    message: "Ім'я користувача занадто довге",
                                },
                            })}
                        />

                        <Input
                            label="Електронна пошта"
                            placeholder="Введіть електронну пошту"
                            error={!!errors.email?.message}
                            {...register("email", {
                                required: "Введіть пошту",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Невірний формат пошти",
                                },
                            })}
                        />

                        <Input
                            label="Пароль"
                            placeholder="Введіть пароль"
                            error={!!errors.password?.message}
                            {...register("password", {
                                required: "Введіть пароль",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Пароль має бути не менше 6 символів",
                                },
                            })}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            Створити
                        </Button>

                        <Button
                            type="button"
                            variant="text"
                            onClick={() =>
                                reset({
                                    username: "",
                                    email: "",
                                    password: "",
                                })
                            }
                        >
                            Скинути
                        </Button>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {errMessages.join(", ")}
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
