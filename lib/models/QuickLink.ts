import mongoose, { Schema, Document } from "mongoose";

export interface IQuickLink extends Document {
  label: string;
  description: string;
  url: string;
  icon: string;
  badge: string;
  active: boolean;
  order: number;
}

const QuickLinkSchema = new Schema<IQuickLink>({
  label: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, default: "#" },
  icon: { type: String, default: "🔗" },
  badge: { type: String, default: "Portal" },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.QuickLink || mongoose.model<IQuickLink>("QuickLink", QuickLinkSchema);
