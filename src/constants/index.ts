export const ROLES = ["OPS", "FINANCE"] as const;
export type Role = (typeof ROLES)[number];

export const PAYOUT_STATUSES = ["Draft", "Submitted", "Approved", "Rejected"] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export const PAYOUT_MODES = ["UPI", "IMPS", "NEFT"] as const;
export type PayoutMode = (typeof PAYOUT_MODES)[number];

export const AUDIT_ACTIONS = ["CREATED", "SUBMITTED", "APPROVED", "REJECTED"] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const STATUS_TRANSITIONS: Record<PayoutStatus, PayoutStatus[]> = {
    Draft: ["Submitted"],
    Submitted: ["Approved", "Rejected"],
    Approved: [],
    Rejected: [],
};

export const STATUS_TO_AUDIT: Record<PayoutStatus, AuditAction> = {
    Draft: "CREATED",
    Submitted: "SUBMITTED",
    Approved: "APPROVED",
    Rejected: "REJECTED",
};
