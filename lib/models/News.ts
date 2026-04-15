import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  published: boolean;
}

const NewsSchema = new Schema<INews>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  category: { type: String, default: "Notice" },
  date: { type: String, default: "" },
  author: { type: String, default: "Admin" },
  published: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
