import { Request } from "express";
import { Document, Types } from "mongoose";
import { Role, PayoutStatus, PayoutMode, AuditAction } from "../constants";

export interface JwtPayload {
    userId: string;
    role: Role;
    email: string;
    name: string;
}

export interface AuthRequest extends Request {
    user: JwtPayload;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}

export interface IVendor extends Document {
    name: string;
    upi_id?: string;
    bank_account?: string;
    ifsc?: string;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPayout extends Document {
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

export interface IPayoutAudit extends Document {
    payout_id: Types.ObjectId;
    action: AuditAction;
    performed_by: Types.ObjectId;
    performer_name: string;
    note?: string;
    createdAt: Date;
}

export interface ApiSuccess<T = unknown> {
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
