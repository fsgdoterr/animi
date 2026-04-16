export class AppError extends Error {
    constructor(
        readonly message: string,
        readonly status: number = 400,
        readonly errors: any[] = [],
        readonly headers: HeadersInit = {},
    ) {
        super(message);
    }
}

export class BadRequestError extends AppError {
    constructor(
        message: string,
        errors: any[] = [],
        headers: HeadersInit = {},
    ) {
        super(message, 400, errors, headers);
    }
}

export class UnauthorizedError extends AppError {
    constructor(
        message: string = "Ви не авторизовані",
        errors: any[] = [],
        headers: HeadersInit = {},
    ) {
        super(message, 401, errors, headers);
    }
}

export class ForbiddenError extends AppError {
    constructor(
        message: string = "У вас немає доступу",
        errors: any[] = [],
        headers: HeadersInit = {},
    ) {
        super(message, 403, errors, headers);
    }
}

export class NotFoundError extends AppError {
    constructor(
        message: string = "Ресурс не знайдено",
        errors: any[] = [],
        headers: HeadersInit = {},
    ) {
        super(message, 404, errors, headers);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(
        message: string = "Забагато запитів, спробуйте пізніше",
        errors: any[] = [],
        headers: HeadersInit = {},
    ) {
        super(message, 429, errors, headers);
    }
}

export class InternalServerError extends AppError {
    constructor(
        message: string = "Внутрішня помилка сервера",
        errors: any[] = [],
        headers: HeadersInit = {},
    ) {
        super(message, 500, errors, headers);
    }
}
