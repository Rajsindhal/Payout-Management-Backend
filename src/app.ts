import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env";
import { notFound, globalErrorHandler } from "./middleware/error.middleware";

// ─── Route Imports (uncomment as they are implemented) ────────────────────────
import authRoutes from "./routes/auth.routes";
// import vendorRoutes from "./routes/vendor.routes";
// import payoutRoutes from "./routes/payout.routes";

const app: Application = express();

app.use(helmet());
app.use(
    cors({
        origin: env.ALLOWED_ORIGINS,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        status: "OK",
        environment: env.NODE_ENV,
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/vendors", vendorRoutes);
// app.use("/api/v1/payouts", payoutRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
