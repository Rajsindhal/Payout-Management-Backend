import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";
import { ROLES } from "../constants";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        role: { type: String, enum: ROLES, required: true },
    },
    { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
};
userSchema.options.toJSON = {
    transform: (_doc, ret: Record<string, unknown>) => {
        delete ret["password"];
        return ret;
    },
};

export default model<IUser>("User", userSchema);
