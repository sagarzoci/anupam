import mongoose, { Schema, Document } from "mongoose";

export interface IPopupNotice extends Document {
  title: string; subtitle: string; badge: string; body: string;
  image: string; fileId: string;   // ImageKit fileId for deletion
  tags: string[]; primaryBtnText: string; primaryBtnHref: string;
  active: boolean; order: number;
}

const PopupNoticeSchema = new Schema<IPopupNotice>({
  title: { type: String, required: true },
  subtitle: { type: String, default: "FEATURED SCHOOL UPDATE" },
  badge: { type: String, default: "IMPORTANT NOTICE" },
  body: { type: String, default: "" },
  image: { type: String, default: "" },
  fileId: { type: String, default: "" },
  tags: { type: [String], default: [] },
  primaryBtnText: { type: String, default: "View Notice" },
  primaryBtnHref: { type: String, default: "/notices" },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.PopupNotice ||
  mongoose.model<IPopupNotice>("PopupNotice", PopupNoticeSchema);
