import { Request, Response } from "express";
import Payout from "../models/Payout.model";
import Vendor from "../models/Vendor.model";
import PayoutAudit from "../models/PayoutAudit.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { logAudit } from "../utils/auditLogger";
import { AuthRequest } from "../types";
import { STATUS_TRANSITIONS } from "../constants";

export const getPayouts = asyncHandler(async (req: Request, res: Response) => {
    const { status, vendor_id } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status as string;
    if (vendor_id) filter.vendor_id = vendor_id as string;

    const payouts = await Payout.find(filter)
        .populate("vendor_id", "name upi_id bank_account ifsc")
        .populate("created_by", "name email")
        .sort({ createdAt: -1 });

    ApiResponse.ok(res, "Payouts fetched successfully", { payouts });
});

export const getPayoutById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const payout = await Payout.findById(id)
        .populate("vendor_id", "name upi_id bank_account ifsc")
        .populate("created_by", "name email");

    if (!payout) {
        throw ApiError.notFound("Payout not found");
    }

    const auditTrail = await PayoutAudit.find({ payout_id: id }).sort({ createdAt: 1 });

    ApiResponse.ok(res, "Payout details fetched successfully", { payout, auditTrail });
});

export const createPayout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { vendor_id, amount, mode, note } = req.body;

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor || !vendor.is_active) {
        throw ApiError.badRequest("Selected vendor is invalid or inactive");
    }

    const payout = await Payout.create({
        vendor_id,
        amount,
        mode,
        note,
        status: "Draft",
        created_by: authReq.user.userId
    });

    await logAudit({
        payout_id: String(payout._id),
        action: "CREATED",
        performed_by: authReq.user.userId,
        performer_name: authReq.user.name,
        note: "Payout created in Draft status"
    });

    ApiResponse.created(res, "Payout created successfully", { payout });
});

export const submitPayout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const payout = await Payout.findById(id);
    if (!payout) throw ApiError.notFound("Payout not found");

    if (!STATUS_TRANSITIONS[payout.status].includes("Submitted")) {
        throw ApiError.unprocessable(`Cannot submit payout from current status: ${payout.status}`);
    }

    payout.status = "Submitted";
    await payout.save();

    await logAudit({
        payout_id: String(payout._id),
        action: "SUBMITTED",
        performed_by: authReq.user.userId,
        performer_name: authReq.user.name
    });

    ApiResponse.ok(res, "Payout submitted successfully", { payout });
});

export const approvePayout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const payout = await Payout.findById(id);
    if (!payout) throw ApiError.notFound("Payout not found");

    if (!STATUS_TRANSITIONS[payout.status].includes("Approved")) {
        throw ApiError.unprocessable(`Cannot approve payout from current status: ${payout.status}`);
    }

    payout.status = "Approved";
    await payout.save();

    await logAudit({
        payout_id: String(payout._id),
        action: "APPROVED",
        performed_by: authReq.user.userId,
        performer_name: authReq.user.name
    });

    ApiResponse.ok(res, "Payout approved successfully", { payout });
});

export const rejectPayout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const { decision_reason } = req.body;

    const payout = await Payout.findById(id);
    if (!payout) throw ApiError.notFound("Payout not found");

    if (!STATUS_TRANSITIONS[payout.status].includes("Rejected")) {
        throw ApiError.unprocessable(`Cannot reject payout from current status: ${payout.status}`);
    }

    payout.status = "Rejected";
    payout.decision_reason = decision_reason;
    await payout.save();

    await logAudit({
        payout_id: String(payout._id),
        action: "REJECTED",
        performed_by: authReq.user.userId,
        performer_name: authReq.user.name,
        note: decision_reason
    });

    ApiResponse.ok(res, "Payout rejected successfully", { payout });
});
