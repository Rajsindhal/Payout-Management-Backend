import { Request, Response } from "express";
import User from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../types";

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    generateToken(res, {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
    });

    ApiResponse.ok(res, "Login successful", { user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie("token");
    ApiResponse.ok(res, "Logged out successfully");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user.userId);
    if (!user) {
        throw ApiError.notFound("User not found");
    }

    ApiResponse.ok(res, "User details fetched successfully", { user });
});
