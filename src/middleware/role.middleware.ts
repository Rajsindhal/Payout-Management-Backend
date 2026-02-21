import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../types";
import { Role } from "../constants";

export const requireRole = (...allowedRoles: Role[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            return next(ApiError.unauthorized("User not authenticated"));
        }

        if (!allowedRoles.includes(authReq.user.role)) {
            return next(
                ApiError.forbidden(
                    `Access denied. Requires one of: ${allowedRoles.join(", ")}`
                )
            );
        }

        next();
    };
};
