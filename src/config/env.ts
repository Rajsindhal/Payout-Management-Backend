const requiredVars = ["MONGO_URI", "JWT_SECRET"] as const;

for (const key of requiredVars) {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: "${key}"`);
        process.exit(1);
    }
}

const env = {
    PORT: parseInt(process.env.PORT ?? "5000", 10),
    NODE_ENV: (process.env.NODE_ENV ?? "development") as "development" | "production" | "test",

    MONGO_URI: process.env.MONGO_URI as string,

    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
    COOKIE_EXPIRES_IN: parseInt(process.env.COOKIE_EXPIRES_IN ?? "7", 10),

    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
        .split(",")
        .map((o) => o.trim()),
} as const;

export default env;
