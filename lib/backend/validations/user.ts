import { UserPermissions } from "@/lib/generated/prisma/client";
import { z } from "zod";

export const createUserSchema = z
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
    });

export type CreateUserBody = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.extend({
    permissions: z.array(z.nativeEnum(UserPermissions)).optional(),
}).partial();

export type UpdateUserBody = z.infer<typeof updateUserSchema>;