import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env";
import { JwtPayload } from "../types";

export const generateToken = (res: Response, payload: JwtPayload): string => {
    const token = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    });

    return token;
};
