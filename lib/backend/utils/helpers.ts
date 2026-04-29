import { BadRequestError } from "@/lib/backend/utils/errors";

export const getPositiveIntParam = (
    value: string | null,
    fallback: number,
    max?: number,
) => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
        return fallback;
    }

    return max ? Math.min(parsed, max) : parsed;
};

export const getOptionalPositiveIntParam = (value: string | null, name: string) => {
    if (!value) return undefined;

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new BadRequestError(`Невірний параметр ${name}`);
    }

    return parsed;
};