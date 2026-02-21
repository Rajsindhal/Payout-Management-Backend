import { Request, Response } from "express";
import Vendor from "../models/Vendor.model";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

export const getVendors = asyncHandler(async (_req: Request, res: Response) => {
    const vendors = await Vendor.find({ is_active: true })
        .sort({ name: 1 })
        .select("-__v");

    ApiResponse.ok(res, "Vendors fetched successfully", { vendors });
});

export const createVendor = asyncHandler(async (req: Request, res: Response) => {
    const { name, upi_id, bank_account, ifsc } = req.body;

    const vendorData = { name };
    if (upi_id) Object.assign(vendorData, { upi_id });
    if (bank_account) Object.assign(vendorData, { bank_account });
    if (ifsc) Object.assign(vendorData, { ifsc });

    const vendor = await Vendor.create(vendorData);

    ApiResponse.created(res, "Vendor created successfully", { vendor });
});
