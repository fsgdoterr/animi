"use client";

import AdminPageHeader from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
    useGetUserQuery,
    useUpdateUserMutation,
} from "@/lib/frontend/store/api/users-api";
import { ArrowLeft, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormValues {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isModer: boolean;
}

interface Props {
    params: Promise<{ id: string }>;
}

export default function UserPage({ params }: Props) {
    const { id } = use(params);
    const userId = Number(id);
    const router = useRouter();

    const { data: user, isLoading, isError } = useGetUserQuery(userId);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<IFormValues>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            isAdmin: false,
            isModer: false,
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                email: user.email,
                password: "",
                isAdmin: user.permissions.includes("ADMIN"),
                isModer: user.permissions.includes("MODER"),
            });
        }
    }, [user, reset]);

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        const permissions: string[] = ["USER"];
        if (data.isModer) permissions.push("MODER");
        if (data.isAdmin) permissions.push("ADMIN");

        try {
            await updateUser({
                id: userId,
                body: {
                    username: data.username || undefined,
                    email: data.email || undefined,
                    password: data.password || undefined,
                    permissions,
                },
            }).unwrap();
            reset({ ...data, password: "" });
        } catch (e: any) {
            console.error("Update error", e);
        }
    };

    const errMessages = Object.values(errors)
        .map((err) => err.message)
        .filter(Boolean);

    if (isLoading) {
        return (
            <div className="w-full h-full p-8 flex items-center justify-center text-(--text-2)">
                Завантаження...
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="w-full h-full p-8 flex flex-col gap-4 items-center justify-center">
                <p className="text-(--text-2)">Користувача не знайдено</p>
                <Button variant="secondary" onClick={() => router.push("/admin/users")}>
                    Назад до списку
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-8 flex flex-col gap-4">
            <Button
                variant="text"
                onClick={() => router.push("/admin/users")}
                leftIcon={<ArrowLeft size={16} />}
                className="self-start"
            >
                Назад до списку
            </Button>

            <AdminPageHeader
                title={`Редагування: ${user.username}`}
                subtitle={`ID: ${user.id} · ${user.email}`}
                icon={<UserCog size={64} />}
            />

            <hr />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 max-w-lg"
            >
                <h3 className="text-2xl">Основні дані</h3>

                <Input
                    label="Ім'я користувача"
                    placeholder="Введіть ім'я користувача"
                    error={!!errors.username?.message}
                    {...register("username", {
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
                    label="Електронна пошта"
                    placeholder="Введіть електронну пошту"
                    error={!!errors.email?.message}
                    {...register("email", {
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Невірний формат пошти",
                        },
                    })}
                />

                <Input
                    label="Новий пароль"
                    placeholder="Залиште порожнім, щоб не змінювати"
                    type="password"
                    error={!!errors.password?.message}
                    {...register("password", {
                        minLength: {
                            value: 6,
                            message: "Пароль має бути не менше 6 символів",
                        },
                    })}
                />

                <hr />

                <h3 className="text-2xl">Ролі</h3>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-(--flame-1) cursor-pointer"
                            {...register("isModer")}
                        />
                        <span>Модератор</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-(--flame-1) cursor-pointer"
                            {...register("isAdmin")}
                        />
                        <span>Адміністратор</span>
                    </label>
                </div>

                {errMessages.length > 0 && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                        {errMessages.join(", ")}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isDirty || isUpdating}
                        loading={isUpdating}
                    >
                        Зберегти
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            reset({
                                username: user.username,
                                email: user.email,
                                password: "",
                                isAdmin: user.permissions.includes("ADMIN"),
                                isModer: user.permissions.includes("MODER"),
                            })
                        }
                    >
                        Скинути
                    </Button>
                </div>
            </form>
        </div>
    );
}