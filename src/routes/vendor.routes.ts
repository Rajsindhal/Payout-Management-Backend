import { Router } from "express";
import { getVendors, createVendor } from "../controllers/vendor.controller";
import { createVendorValidation } from "../validations/vendor.validation";
import { validate } from "../validations/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole("OPS", "FINANCE"), getVendors);

router.post(
    "/",
    requireRole("OPS"),
    createVendorValidation,
    validate,
    createVendor
);

export default router;
