import mongoose, { Schema, Document } from "mongoose";

export type ContactStatus = "unread" | "read" | "replied";

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  /** IP address of the sender — used for rate limiting audit */
  ip: string;
  /** Timestamp when the message was received */
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    ip: { type: String, default: "" },
  },
  { timestamps: true },
);

// Index for fast admin queries (newest first)
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
