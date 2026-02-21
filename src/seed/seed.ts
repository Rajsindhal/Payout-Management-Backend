import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.model";
import env from "../config/env";

const seedUsers = [
    { name: "Ops User", email: "ops@demo.com", password: "ops123", role: "OPS" },
    { name: "Finance User", email: "finance@demo.com", password: "fin123", role: "FINANCE" },
];

const seed = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGO_URI);

        for (const userData of seedUsers) {
            const existingUser = await User.findOne({ email: userData.email });

            if (!existingUser) {
                await User.create(userData);
                console.log(`Created ${userData.role} User: ${userData.email}`);
            } else {
                console.log(`Skipped ${userData.role} User: ${userData.email} (already exists)`);
            }
        }

    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

seed();
