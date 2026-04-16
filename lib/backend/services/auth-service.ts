import { BadRequestError } from "@/lib/backend/utils/errors";
import { signSession } from "@/lib/backend/utils/session";
import { SigninBody, SignupBody } from "@/lib/backend/validations/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const signup = async ({ username, email, password }: SignupBody) => {
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
        select: { id: true, email: true, username: true },
    });
    if (existingUser && existingUser.email === email)
        throw new BadRequestError("Користувач з таким email вже існує");
    if (existingUser && existingUser.username === username)
        throw new BadRequestError("Користувач з таким username вже існує");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { username, email, password: passwordHash },
        select: {
            id: true,
            email: true,
            username: true,
            permissions: true,
            createdAt: true,
        },
    });

    const token = await signSession(user);

    return {
        user,
        token,
    };
};

export const signin = async ({ password, username }: SigninBody) => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ email: username }, { username }] },
    });

    if (!user) throw new BadRequestError("Невірне ім'я користувача або пароль");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
        throw new BadRequestError("Невірне ім'я користувача або пароль");

    const token = await signSession({
        id: user.id,
        email: user.email,
        username: user.username,
        permissions: user.permissions,
        createdAt: user.createdAt,
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            permissions: user.permissions,
            createdAt: user.createdAt,
        },
        token,
    };
};
