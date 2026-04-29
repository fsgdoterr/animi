import { signup } from "@/lib/backend/services/auth-service";
import { routeMiddleware, withJsonBody, withUser } from "@/lib/backend/utils/handlers";
import { SuccessResponse } from "@/lib/backend/utils/responses";
import { setSessionCookie } from "@/lib/backend/utils/session-cookie";
import { signupSchema } from "@/lib/backend/validations/auth";

export const POST = routeMiddleware(
    withJsonBody(signupSchema),
    async (request, ctx) => {
        const { user, token } = await signup(ctx.body);
        await setSessionCookie(token);
        return SuccessResponse({ user });
    }
);
