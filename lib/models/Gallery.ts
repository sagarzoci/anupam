import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  src: string;
  fileId: string;   // ImageKit fileId — used to delete from ImageKit
  alt: string;
  category: string;
}

const GallerySchema = new Schema<IGallery>({
  src: { type: String, required: true },
  fileId: { type: String, default: "" },
  alt: { type: String, default: "School photo" },
  category: { type: String, default: "Campus" },
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
