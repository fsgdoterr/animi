interface ApiValidationError {
    path?: string;
    message?: string;
}

interface ApiErrorData {
    message?: string;
    errors?: ApiValidationError[];
}

interface FetchBaseQueryErrorLike {
    status?: number | string;
    data?: ApiErrorData | string;
    error?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

export const getApiErrorMessage = (error: unknown, fallback = "Щось пішло не так") => {
    if (!isRecord(error)) return fallback;

    const queryError = error as FetchBaseQueryErrorLike;

    if (typeof queryError.data === "string") {
        return queryError.data;
    }

    if (queryError.data?.errors?.length) {
        return queryError.data.errors
            .map((item) => item.message)
            .filter(Boolean)
            .join(". ");
    }

    if (queryError.data?.message) {
        return queryError.data.message;
    }

    if (queryError.error) {
        return queryError.error;
    }

    return fallback;
};
