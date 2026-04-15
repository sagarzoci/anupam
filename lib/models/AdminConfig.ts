import mongoose, { Schema, Document } from "mongoose";

/**
 * AdminConfig stores admin credentials that can be changed at runtime
 * without redeploying the app. When present, these override the
 * ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
 *
 * The password is stored as a scrypt hash (Node built-in, no extra packages).
 */
export interface IAdminConfig extends Document {
  email: string;
  /** scrypt-derived key, hex-encoded */
  passwordHash: string;
  /** random salt, hex-encoded */
  salt: string;
}

const AdminConfigSchema = new Schema<IAdminConfig>(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.AdminConfig ||
  mongoose.model<IAdminConfig>("AdminConfig", AdminConfigSchema);
