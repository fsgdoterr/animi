import {
    AppError,
    BadRequestError,
    ForbiddenError,
    UnauthorizedError,
} from "@/lib/backend/utils/errors";
import { getOptionalPositiveIntParam, getPositiveIntParam } from "@/lib/backend/utils/helpers";
import { InternalServerErrorResponse } from "@/lib/backend/utils/responses";
import { verifySession } from "@/lib/backend/utils/session";
import { User, UserPermissions } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { z, ZodError } from "zod";

// -- Base context & handler types --

type BaseContext<TParams = Record<string, string>> = {
    params: TParams;
};

type Handler<TCtx extends BaseContext = BaseContext> = (
    req: NextRequest,
    ctx: TCtx,
) => Promise<Response>;

type MaybePromise<T> = T | Promise<T>;

type AnyContext = BaseContext<unknown> & Record<string, unknown>;

type RouteMiddleware<
    TNeedCtx extends object = {},
    TAddedCtx extends object = {},
> = ((
    req: NextRequest,
    ctx: AnyContext & TNeedCtx,
) => MaybePromise<TAddedCtx>) & {
    readonly __need?: TNeedCtx;
    readonly __add?: TAddedCtx;
};

type AddedOf<TMiddleware> = TMiddleware extends {
    readonly __add?: infer TAddedCtx extends object;
}
    ? TAddedCtx
    : {};

type ApplyMiddlewares<
    TCtx,
    TMiddlewares extends readonly unknown[],
> = TMiddlewares extends readonly [
    infer TFirstMiddleware,
    ...infer TRestMiddlewares,
]
    ? ApplyMiddlewares<TCtx & AddedOf<TFirstMiddleware>, TRestMiddlewares>
    : TCtx;

// -- routeMiddleware --

export const routeMiddleware = <
    const TMiddlewares extends readonly RouteMiddleware<any, any>[],
>(
    ...args: [
        ...middlewares: TMiddlewares,
        handler: Handler<ApplyMiddlewares<BaseContext, TMiddlewares>>,
    ]
) => {
    const middlewares = args.slice(0, -1) as RouteMiddleware<any, any>[];

    const handler = args[args.length - 1] as Handler<
        ApplyMiddlewares<BaseContext, TMiddlewares>
    >;

    return async (
        request: NextRequest,
        ctx: { params: Promise<Record<string, string>> },
    ) => {
        try {
            const params = await ctx.params;

            const currentCtx: AnyContext = {
                params,
            };

            for (const middleware of middlewares) {
                const addedCtx = await middleware(request, currentCtx);

                if (addedCtx && typeof addedCtx === "object") {
                    Object.assign(currentCtx, addedCtx);
                }
            }

            return await handler(
                request,
                currentCtx as ApplyMiddlewares<BaseContext, TMiddlewares>,
            );
        } catch (e) {
            console.error("API ERROR", e);

            if (e instanceof AppError) {
                return Response.json(
                    {
                        ok: false,
                        message: e.message,
                        errors: e.errors,
                    },
                    {
                        status: e.status,
                        headers: e.headers,
                    },
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

export const withJsonBody = <const TSchema extends z.ZodTypeAny>(
    schema: TSchema,
): RouteMiddleware<{}, { body: z.output<TSchema> }> => {
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

        const body = result.data as z.output<TSchema>;

        ctx.body = body;

        return {
            body,
        };
    };
};

// -- withUser --

export const withUser = (async (req, ctx) => {
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
        where: {
            id: session.id,
        },
    });

    if (!user) {
        throw new UnauthorizedError();
    }

    ctx.user = user;

    return {
        user,
    };
}) as RouteMiddleware<{}, { user: User }>;

// -- withAdmin --

export const withAdmin = (async (req, ctx) => {
    const { user } = await withUser(req, ctx);

    if (!user.permissions.includes(UserPermissions.ADMIN)) {
        throw new ForbiddenError();
    }

    ctx.user = user;

    return {
        user,
    };
}) as RouteMiddleware<{}, { user: User }>;

export type Pagination = { limit: number; cursor: number | null };

export const withPagination = (async (req, ctx) => {
    const { searchParams } = new URL(req.url);

    const cursor = getOptionalPositiveIntParam(searchParams.get("cursor"), "cursor");

    const limit = getPositiveIntParam(
        searchParams.get("limit"),
        1,
        100
    );

    return {
        pagination: {
            limit,
            cursor
        }
    };
}) as RouteMiddleware<{}, { pagination: Pagination }>;

// -- withSorting --

export const USER_SORT_FIELDS = ['id', 'username', 'email', 'createdAt', 'ratingsCount'] as const;
export type UserSortField = (typeof USER_SORT_FIELDS)[number];
export type SortOrder = 'asc' | 'desc';
export type Sorting = { sortBy: UserSortField; sortOrder: SortOrder };

export const withSorting = (async (req, ctx) => {
    const { searchParams } = new URL(req.url);
    const rawSortBy = searchParams.get('sortBy') ?? 'id';
    const rawSortOrder = searchParams.get('sortOrder') ?? 'desc';

    if (!(USER_SORT_FIELDS as readonly string[]).includes(rawSortBy)) {
        throw new BadRequestError('Невірний параметр sortBy');
    }
    if (rawSortOrder !== 'asc' && rawSortOrder !== 'desc') {
        throw new BadRequestError('Невірний параметр sortOrder');
    }

    return {
        sorting: {
            sortBy: rawSortBy as UserSortField,
            sortOrder: rawSortOrder as SortOrder,
        },
    };
}) as RouteMiddleware<{}, { sorting: Sorting }>;