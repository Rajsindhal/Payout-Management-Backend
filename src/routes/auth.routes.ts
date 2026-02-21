import { Router } from "express";
import { login, logout, getMe } from "../controllers/auth.controller";
import { loginValidation } from "../validations/auth.validation";
import { validate } from "../validations/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/login", loginValidation, validate, login);

// Protected routes
router.post("/logout", requireAuth, logout);

router.get("/me", requireAuth, getMe);

export default router;
