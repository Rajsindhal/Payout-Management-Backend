import { Router } from "express";
import {
    getPayouts,
    getPayoutById,
    createPayout,
    submitPayout,
    approvePayout,
    rejectPayout
} from "../controllers/payout.controller";
import {
    createPayoutValidation,
    payoutIdValidation,
    rejectPayoutValidation
} from "../validations/payout.validation";
import { validate } from "../validations/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole("OPS", "FINANCE"), getPayouts);
router.get("/:id", payoutIdValidation, validate, requireRole("OPS", "FINANCE"), getPayoutById);

router.post("/", requireRole("OPS"), createPayoutValidation, validate, createPayout);
router.post("/:id/submit", payoutIdValidation, validate, requireRole("OPS"), submitPayout);

router.post("/:id/approve", payoutIdValidation, validate, requireRole("FINANCE"), approvePayout);
router.post("/:id/reject", rejectPayoutValidation, validate, requireRole("FINANCE"), rejectPayout);

export default router;
