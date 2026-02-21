import { Request } from "express";
import { Types } from "mongoose";

export type UserRole = "OPS" | "FINANCE";

export interface JwtPayload {
    userId: string;
    role: UserRole;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}

// ─── MongoDB Document Types ───────────────────────────────────────────────────

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface IVendor {
    _id: Types.ObjectId;
    name: string;
    upi_id?: string;
    bank_account?: string;
    ifsc?: string;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type PayoutStatus = "Draft" | "Submitted" | "Approved" | "Rejected";
export type PayoutMode = "UPI" | "IMPS" | "NEFT";

export interface IPayout {
    _id: Types.ObjectId;
    vendor_id: Types.ObjectId;
    amount: number;
    mode: PayoutMode;
    note?: string;
    status: PayoutStatus;
    decision_reason?: string;
    created_by: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type AuditAction = "CREATED" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface IPayoutAudit {
    _id: Types.ObjectId;
    payout_id: Types.ObjectId;
    action: AuditAction;
    performed_by: Types.ObjectId;
    note?: string;
    createdAt: Date;
}

// ─── Generic API Shape ────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string>;
    stack?: string;
}
