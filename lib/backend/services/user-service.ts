import { BadRequestError, NotFoundError } from "@/lib/backend/utils/errors";
import { Pagination, Sorting, UserSortField } from "@/lib/backend/utils/handlers";
import { CreateUserBody, UpdateUserBody } from "@/lib/backend/validations/user";
import { UserPermissions } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const userSelect = {
    id: true,
    username: true,
    email: true,
    permissions: true,
    createdAt: true,
    _count: {
        select: {
            ratings: true,
        },
    },
} as const;

function buildOrderBy(sortBy: UserSortField, sortOrder: "asc" | "desc") {
    if (sortBy === "ratingsCount") {
        return [{ ratings: { _count: sortOrder } }, { id: sortOrder }];
    }
    if (sortBy === "id") {
        return { id: sortOrder };
    }
    return [{ [sortBy]: sortOrder }, { id: sortOrder }];
}

export const getUsers = async (
    { limit, cursor }: Pagination,
    { sortBy, sortOrder }: Sorting,
) => {
    const users = await prisma.user.findMany({
        select: userSelect,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: buildOrderBy(sortBy, sortOrder),
    });

    let hasMore = false;
    let nextCursor: number | null = null;

    if (users.length > limit) {
        hasMore = true;
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
    }

    return { users, meta: { hasMore, nextCursor } };
};

export const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: userSelect,
    });

    if (!user) throw new NotFoundError("Користувача не знайдено");

    return user;
};

export const createUser = async ({
    email,
    username,
    password,
}: CreateUserBody) => {
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
        select: { id: true, email: true, username: true },
    });
    if (existingUser && existingUser.email === email)
        throw new BadRequestError("Користувач з таким email вже існує");
    if (existingUser && existingUser.username === username)
        throw new BadRequestError("Користувач з таким username вже існує");

    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: await bcrypt.hash(password, 12),
        },
        select: userSelect,
    });

    return user;
};

export const updateUser = async (
    id: number,
    { email, username, password, permissions }: UpdateUserBody,
) => {
    await getUserById(id);

    if (email || username) {
        const existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { id: { not: id } },
                    { OR: [...(email ? [{ email }] : []), ...(username ? [{ username }] : [])] },
                ],
            },
            select: { id: true, email: true, username: true },
        });
        if (existingUser && email && existingUser.email === email)
            throw new BadRequestError("Користувач з таким email вже існує");
        if (existingUser && username && existingUser.username === username)
            throw new BadRequestError("Користувач з таким username вже існує");
    }

    const user = await prisma.user.update({
        where: { id },
        data: {
            ...(email && { email }),
            ...(username && { username }),
            ...(password && { password: await bcrypt.hash(password, 12) }),
            ...(permissions !== undefined && { permissions }),
        },
        select: userSelect,
    });

    return user;
};

export const deleteUser = async (id: number) => {
    await getUserById(id);
    await prisma.user.delete({ where: { id } });
};
