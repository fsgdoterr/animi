import { createUser, getUsers } from "@/lib/backend/services/user-service";
import {
    routeMiddleware,
    withAdmin,
    withJsonBody,
    withPagination,
    withSorting,
} from "@/lib/backend/utils/handlers";
import { SuccessResponse } from "@/lib/backend/utils/responses";
import { createUserSchema } from "@/lib/backend/validations/user";

export const GET = routeMiddleware(
    withAdmin,
    withPagination,
    withSorting,
    async (req, ctx) => {
        const { users, meta } = await getUsers(ctx.pagination, ctx.sorting);

        return SuccessResponse({ users, meta });
    },
);

export const POST = routeMiddleware(
    withAdmin,
    withJsonBody(createUserSchema),
    async (req, ctx) => {
        const user = await createUser(ctx.body);
        return SuccessResponse({ user });
    },
);
