import { Request, Response, NextFunction } from "express";
import { validationResult, FieldValidationError } from "express-validator";
import { ApiError } from "../utils/ApiError";

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors: Record<string, string> = {};

        errors.array().forEach((err) => {
            const fieldError = err as FieldValidationError;
            if (fieldError.path && !formattedErrors[fieldError.path]) {
                formattedErrors[fieldError.path] = fieldError.msg;
            }
        });

        return next(ApiError.badRequest("Validation failed", formattedErrors));
    }

    next();
};
