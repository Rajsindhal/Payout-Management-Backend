import { Schema, model } from "mongoose";
import { IPayout } from "../types";
import { PAYOUT_STATUSES, PAYOUT_MODES } from "../constants";

const payoutSchema = new Schema<IPayout>(
    {
        vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
        amount: { type: Number, required: true, min: [0.01, "Amount must be greater than 0"] },
        mode: { type: String, enum: PAYOUT_MODES, required: true },
        note: { type: String, trim: true, maxlength: [500, "Note cannot exceed 500 characters"], default: null },
        status: { type: String, enum: PAYOUT_STATUSES, default: "Draft" },
        decision_reason: { type: String, trim: true, maxlength: [1000, "Decision reason cannot exceed 1000 characters"], default: null },
        created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true, versionKey: false }
);

payoutSchema.index({ status: 1 });
payoutSchema.index({ vendor_id: 1 });
payoutSchema.index({ status: 1, vendor_id: 1 });
payoutSchema.index({ createdAt: -1 });

payoutSchema.pre<IPayout>("save", function (next) {
    if (this.status === "Rejected" && !this.decision_reason?.trim()) {
        return next(new Error("decision_reason is required when rejecting a payout"));
    }
    next();
});

export default model<IPayout>("Payout", payoutSchema);
