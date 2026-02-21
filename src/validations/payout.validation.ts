import { body, param } from "express-validator";
import { PAYOUT_MODES } from "../constants";

export const createPayoutValidation = [
    body("vendor_id")
        .notEmpty().withMessage("Vendor ID is required")
        .isMongoId().withMessage("Invalid Vendor ID format"),

    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),

    body("mode")
        .notEmpty().withMessage("Payment mode is required")
        .isIn(PAYOUT_MODES).withMessage(`Mode must be one of: ${PAYOUT_MODES.join(", ")}`),

    body("note")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage("Note cannot exceed 500 characters")
];

export const payoutIdValidation = [
    param("id").isMongoId().withMessage("Invalid Payout ID format")
];

export const rejectPayoutValidation = [
    ...payoutIdValidation,
    body("decision_reason")
        .trim()
        .notEmpty().withMessage("Decision reason is required when rejecting a payout")
        .isLength({ max: 1000 }).withMessage("Reason cannot exceed 1000 characters")
];
