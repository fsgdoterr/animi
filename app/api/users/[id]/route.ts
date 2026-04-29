import { deleteUser, getUserById, updateUser } from "@/lib/backend/services/user-service";
import {
    routeMiddleware,
    withAdmin,
    withJsonBody,
} from "@/lib/backend/utils/handlers";
import { SuccessResponse } from "@/lib/backend/utils/responses";
import { updateUserSchema } from "@/lib/backend/validations/user";
import { BadRequestError } from "@/lib/backend/utils/errors";

export const GET = routeMiddleware(
    withAdmin,
    async (req, ctx) => {
        const id = Number(ctx.params.id);
        if (!Number.isInteger(id) || id < 1) throw new BadRequestError("Невірний id");

        const user = await getUserById(id);
        return SuccessResponse({ user });
    },
);

export const PATCH = routeMiddleware(
    withAdmin,
    withJsonBody(updateUserSchema),
    async (req, ctx) => {
        const id = Number(ctx.params.id);
        if (!Number.isInteger(id) || id < 1) throw new BadRequestError("Невірний id");

        const user = await updateUser(id, ctx.body);
        return SuccessResponse({ user });
    },
);

export const DELETE = routeMiddleware(
    withAdmin,
    async (req, ctx) => {
        const id = Number(ctx.params.id);
        if (!Number.isInteger(id) || id < 1) throw new BadRequestError("Невірний id");

        await deleteUser(id);
        return SuccessResponse({ message: "Користувача видалено" });
    },
);