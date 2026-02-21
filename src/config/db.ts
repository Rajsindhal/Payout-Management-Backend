import mongoose from "mongoose";
import env from "./env";

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", true);

        const conn = await mongoose.connect(env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB connected → ${conn.connection.host}`);

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected. Mongoose will attempt to reconnect.");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB reconnected.");
        });

        mongoose.connection.on("error", (err: Error) => {
            console.error("MongoDB runtime error:", err.message);
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(`MongoDB initial connection failed: ${message}`);
        process.exit(1);
    }
};

export default connectDB;
