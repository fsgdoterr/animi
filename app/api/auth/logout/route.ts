import { routeMiddleware } from "@/lib/backend/utils/handlers";
import { SuccessResponse } from "@/lib/backend/utils/responses";
import { clearSessionCookie } from "@/lib/backend/utils/session-cookie";

export const GET = routeMiddleware(async (request, ctx) => {
    await clearSessionCookie();
    return SuccessResponse({ message: "Ви вийшли з системи" });
});
