export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors: Record<string, string> | null;

    constructor(
        statusCode: number,
        message: string,
        errors: Record<string, string> | null = null
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, errors?: Record<string, string>): ApiError {
        return new ApiError(400, message, errors ?? null);
    }

    static unauthorized(message = "Unauthorized. Please log in."): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(
        message = "You do not have permission to perform this action."
    ): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message = "Resource not found."): ApiError {
        return new ApiError(404, message);
    }
    static conflict(message: string): ApiError {
        return new ApiError(409, message);
    }

    static unprocessable(message: string): ApiError {
        return new ApiError(422, message);
    }
    static internal(message = "Something went wrong. Please try again later."): ApiError {
        return new ApiError(500, message);
    }
}
