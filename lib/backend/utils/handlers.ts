import {
    AppError,
    BadRequestError,
    UnauthorizedError,
} from "@/lib/backend/utils/errors";
import { InternalServerErrorResponse } from "@/lib/backend/utils/responses";
import { verifySession } from "@/lib/backend/utils/session";
import { User } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ZodError, ZodSchema } from "zod";

// -- Base context & handler types --

type BaseContext<TParams = Record<string, string>> = {
    params: TParams;
};

type Handler<TCtx extends BaseContext<any> = BaseContext> = (
    req: NextRequest,
    ctx: TCtx,
) => Promise<Response>;

// -- routeMiddleware --

export const routeMiddleware = <TParams = Record<string, string>>(
    callback: Handler<BaseContext<TParams>>,
) => {
    return async (request: NextRequest, ctx: { params: Promise<TParams> }) => {
        try {
            const params = await ctx.params;
            return await callback(request, { params });
        } catch (e) {
            console.error("API ERROR", e);
            if (e instanceof AppError) {
                return Response.json(
                    {
                        ok: false,
                        message: e.message,
                        errors: e.errors,
                    },
                    { status: e.status, headers: e.headers },
                );
            }
            return InternalServerErrorResponse();
        }
    };
};

// -- withJsonBody --

function getZodErrorMessage(error: ZodError) {
    return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
}

export const withJsonBody = <
    TBody,
    TCtx extends BaseContext<any> = BaseContext,
>(
    schema: ZodSchema<TBody>,
    handler: Handler<TCtx & { body: TBody }>,
): Handler<TCtx> => {
    return async (req, ctx) => {
        let rawBody: unknown;

        try {
            rawBody = await req.json();
        } catch {
            throw new BadRequestError("Невірний JSON");
        }

        const result = schema.safeParse(rawBody);

        if (!result.success) {
            throw new BadRequestError(
                "Валідація не пройшла",
                getZodErrorMessage(result.error),
            );
        }

        const extCtx = ctx as TCtx & { body: TBody };
        extCtx.body = result.data;

        return handler(req, extCtx);
    };
};

// -- withUser --

export const withUser = <TCtx extends BaseContext<any> = BaseContext>(
    handler: Handler<TCtx & { user: User }>,
): Handler<TCtx> => {
    return async (req, ctx) => {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            throw new UnauthorizedError();
        }

        let session;
        try {
            session = await verifySession(sessionToken);
        } catch {
            throw new UnauthorizedError();
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id },
        });

        if (!user) {
            throw new UnauthorizedError();
        }

        const extCtx = ctx as TCtx & { user: User };
        extCtx.user = user;

        return handler(req, extCtx);
    };
};
