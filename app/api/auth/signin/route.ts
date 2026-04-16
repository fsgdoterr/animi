import { signin } from "@/lib/backend/services/auth-service";
import { routeMiddleware, withJsonBody } from "@/lib/backend/utils/handlers";
import { SuccessResponse } from "@/lib/backend/utils/responses";
import { setSessionCookie } from "@/lib/backend/utils/session-cookie";
import { signinSchema } from "@/lib/backend/validations/auth";

export const POST = routeMiddleware(
    withJsonBody(signinSchema, async (request, ctx) => {
        const { user, token } = await signin(ctx.body);
        await setSessionCookie(token);
        return SuccessResponse({ user });
    }),
);
