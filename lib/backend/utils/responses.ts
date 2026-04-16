export const SuccessResponse = (
    data: Record<string, any>,
    headers: HeadersInit = {},
) => Response.json({ ok: true, ...data }, { headers });

export const ErrorResponse = (
    message: string,
    status: number = 400,
    headers: HeadersInit = {},
) => Response.json({ ok: false, message }, { status, headers });

export const CreatedResponse = (
    data: Record<string, any>,
    headers: HeadersInit = {},
) => Response.json({ ok: true, ...data }, { status: 201, headers });

export const BadRequestResponse = (
    message: string,
    errors: any[] = [],
    headers: HeadersInit = {},
) => Response.json({ ok: false, message, errors }, { status: 400, headers });

export const UnauthorizedResponse = (
    message: string = "Ви не авторизовані",
    errors: any[] = [],
    headers: HeadersInit = {},
) => Response.json({ ok: false, message, errors }, { status: 401, headers });

export const ForbiddenResponse = (
    message: string = "У вас немає доступу",
    errors: any[] = [],
    headers: HeadersInit = {},
) => Response.json({ ok: false, message, errors }, { status: 403, headers });

export const NotFoundResponse = (
    message: string = "Ресурс не знайдено",
    errors: any[] = [],
    headers: HeadersInit = {},
) => Response.json({ ok: false, message, errors }, { status: 404, headers });

export const TooManyRequestsResponse = (
    message: string = "Забагато запитів, спробуйте пізніше",
    errors: any[] = [],
    headers: HeadersInit = {},
) => Response.json({ ok: false, message, errors }, { status: 429, headers });

export const InternalServerErrorResponse = (
    message: string = "Внутрішня помилка сервера",
    errors: any[] = [],
    headers: HeadersInit = {},
) => Response.json({ ok: false, message, errors }, { status: 500, headers });
