import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { ApiErrorResponse } from "../types";
import env from "../config/env";

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const globalErrorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): void => {
    const { statusCode, message, errors, stack } = normaliseError(err);

    const payload: ApiErrorResponse = {
        success: false,
        message,
        ...(errors && { errors }),
        ...(env.NODE_ENV === "development" && { stack }),
    };

    if (statusCode === 500) {
        console.error("Unhandled Error:", err);
    }

    res.status(statusCode).json(payload);
};

interface NormalisedError {
    statusCode: number;
    message: string;
    errors: Record<string, string> | null;
    stack?: string;
}

function normaliseError(err: unknown): NormalisedError {
    const stack = err instanceof Error ? err.stack : undefined;

    if (err instanceof ApiError) {
        return {
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
            stack,
        };
    }

    if (err instanceof MongooseError.ValidationError) {
        const errors: Record<string, string> = {};
        for (const [field, error] of Object.entries(err.errors)) {
            errors[field] = error.message;
        }
        return {
            statusCode: 400,
            message: "Validation failed. Please check the provided data.",
            errors,
            stack,
        };
    }

    if (err instanceof MongooseError.CastError) {
        return {
            statusCode: 400,
            message: `Invalid value for field "${err.path}": ${err.value}`,
            errors: null,
            stack,
        };
    }

    if (
        typeof err === "object" &&
        err !== null &&
        (err as { code?: number }).code === 11000
    ) {
        const duplicateErr = err as { keyValue?: Record<string, unknown> };
        const field = duplicateErr.keyValue ? Object.keys(duplicateErr.keyValue)[0] : "field";
        return {
            statusCode: 409,
            message: `The value for "${field}" already exists.`,
            errors: null,
            stack: err instanceof Error ? err.stack : undefined,
        };
    }

    if (err instanceof TokenExpiredError) {
        return {
            statusCode: 401,
            message: "Your session has expired. Please log in again.",
            errors: null,
            stack,
        };
    }

    if (err instanceof JsonWebTokenError) {
        return {
            statusCode: 401,
            message: "Invalid authentication token. Please log in again.",
            errors: null,
            stack,
        };
    }

    return {
        statusCode: 500,
        message: "Something went wrong. Please try again later.",
        errors: null,
        stack,
    };
}
