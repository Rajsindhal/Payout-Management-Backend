import { Schema, model } from "mongoose";
import { IVendor } from "../types";

const vendorSchema = new Schema<IVendor>(
    {
        name: { type: String, required: true, trim: true },
        upi_id: { type: String, trim: true, default: null },
        bank_account: { type: String, trim: true, default: null },
        ifsc: { type: String, trim: true, uppercase: true, default: null },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

vendorSchema.index({ name: "text" });
vendorSchema.index({ is_active: 1, name: 1 });

export default model<IVendor>("Vendor", vendorSchema);
