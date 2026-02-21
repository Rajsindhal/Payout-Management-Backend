import "dotenv/config";
import app from "./src/app";
import connectDB from "./src/config/db";
import env from "./src/config/env";
import mongoose from "mongoose";

process.on("uncaughtException", (err: Error) => {
    console.error("UNCAUGHT EXCEPTION — shutting down...");
    console.error(`   ${err.name}: ${err.message}`);
    process.exit(1);
});

const startServer = async (): Promise<void> => {
    await connectDB();
    const server = app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
        console.log(`Environment : ${env.NODE_ENV}`);
        console.log(`Health check: http://localhost:${env.PORT}/health`);
    });

    process.on("unhandledRejection", (reason: unknown) => {
        console.error("UNHANDLED REJECTION — shutting down gracefully...");
        console.error(reason);

        server.close(async () => {
            await mongoose.connection.close();
            process.exit(1);
        });
    });

    process.on("SIGTERM", () => {
        server.close(async () => {
            await mongoose.connection.close();
            console.log("✅ HTTP server & DB connection closed. Goodbye!");
            process.exit(0);
        });
    });
};

startServer();
