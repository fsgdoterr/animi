import { z } from "zod";

export const signupSchema = z
    .object({
        email: z
            .string()
            .min(1, "Пошта є обов'язковою")
            .email("Невірний формат пошти"),

        username: z
            .string()
            .min(3, "Ім'я користувача має бути не менше 3 символів")
            .max(30, "Ім'я користувача занадто довге"),

        password: z.string().min(6, "Пароль має бути не менше 6 символів"),

        confirmPassword: z
            .string()
            .min(6, "Підтвердження пароля є обов'язковим"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Паролі не збігаються",
        path: ["confirmPassword"],
    });

export type SignupBody = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    username: z.string().min(1, "Ім'я користувача є обов'язковим"),

    password: z.string().min(1, "Пароль є обов'язковим"),
});

export type SigninBody = z.infer<typeof signinSchema>;
