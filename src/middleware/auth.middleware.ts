import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import env from "../config/env";
import { AuthRequest, JwtPayload } from "../types";

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
        next(error);
    }
};
