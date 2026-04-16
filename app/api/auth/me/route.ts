import { routeMiddleware, withUser } from "@/lib/backend/utils/handlers";
import { SuccessResponse } from "@/lib/backend/utils/responses";

export const GET = routeMiddleware(
    withUser(async (req, ctx) => {
        return SuccessResponse({
            user: {
                id: ctx.user.id,
                email: ctx.user.email,
                username: ctx.user.username,
                permissions: ctx.user.permissions,
                createdAt: ctx.user.createdAt,
            },
        });
    }),
);
