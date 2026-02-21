import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import env from "../config/env";
import { AuthRequest, JwtPayload } from "../types";

/**
 * Protects routes by verifying the JWT stored in the httpOnly cookie.
 * Attaches the decoded payload to req.user for downstream use.
 */
export const requireAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const token = req.cookies.token;

    if (!token) {
        return next(ApiError.unauthorized("Authentication token missing. Please log in."));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        // Note: JsonWebTokenError and TokenExpiredError instances are automatically 
        // mapped to 401s in our global error handler because they bubble up through next(error)
        next(error);
    }
};
