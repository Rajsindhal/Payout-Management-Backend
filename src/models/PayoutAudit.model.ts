import { Schema, model } from "mongoose";
import { IPayoutAudit } from "../types";
import { AUDIT_ACTIONS } from "../constants";

const payoutAuditSchema = new Schema<IPayoutAudit>(
    {
        payout_id: { type: Schema.Types.ObjectId, ref: "Payout", required: true, immutable: true },
        action: { type: String, enum: AUDIT_ACTIONS, required: true, immutable: true },
        performed_by: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true },
        performer_name: { type: String, required: true, trim: true, immutable: true },
        note: { type: String, trim: true, default: null },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
    }
);

payoutAuditSchema.index({ payout_id: 1 });
payoutAuditSchema.index({ payout_id: 1, createdAt: 1 });

export default model<IPayoutAudit>("PayoutAudit", payoutAuditSchema);
