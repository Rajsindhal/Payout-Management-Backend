import { body } from "express-validator";

export const createVendorValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Vendor name is required")
        .isLength({ min: 2, max: 150 }).withMessage("Name must be between 2 and 150 characters"),

    body("upi_id")
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[\w.\-]+@[\w]+$/).withMessage("Please provide a valid UPI ID (e.g., vendor@oksbi)"),

    body("bank_account")
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^\d{9,18}$/).withMessage("Bank account must be between 9 and 18 digits"),

    body("ifsc")
        .optional({ checkFalsy: true })
        .trim()
        .toUpperCase()
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage("Please provide a valid IFSC code (e.g., SBIN0001234)"),
];
