import PayoutAudit from "../models/PayoutAudit.model";
import { AuditAction } from "../constants";
import { Types } from "mongoose";

interface LogAuditParams {
    payout_id: Types.ObjectId | string;
    action: AuditAction;
    performed_by: Types.ObjectId | string;
    performer_name: string;
    note?: string;
}

export const logAudit = async (params: LogAuditParams): Promise<void> => {
    await PayoutAudit.create(params);
};
