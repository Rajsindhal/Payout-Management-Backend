import { Response } from "express";
import { ApiSuccessResponse } from "../types";

export class ApiResponse {
    static success<T>(
        res: Response,
        statusCode: number,
        message: string,
        data?: T,
        meta?: Record<string, unknown>
    ): Response {
        const payload: ApiSuccessResponse<T> = { success: true, message };
        if (data !== undefined) payload.data = data;
        if (meta !== undefined) payload.meta = meta;
        return res.status(statusCode).json(payload);
    }

    static ok<T>(
        res: Response,
        message: string,
        data?: T,
        meta?: Record<string, unknown>
    ): Response {
        return ApiResponse.success(res, 200, message, data, meta);
    }

    static created<T>(res: Response, message: string, data?: T): Response {
        return ApiResponse.success(res, 201, message, data);
    }
    static noContent(res: Response): Response {
        return res.status(204).send();
    }
}
