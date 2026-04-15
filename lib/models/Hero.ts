import mongoose, { Schema, Document } from "mongoose";

// HeroConfig — the shared text/button config (one document)
export interface IHeroConfig extends Document {
  schoolName: string; tagline: string; description: string;
  primaryBtn: string; primaryBtnHref: string;
  secondaryBtn: string; secondaryBtnHref: string;
  badge: string;
}

const HeroConfigSchema = new Schema<IHeroConfig>({
  schoolName: { type: String, default: "Anupam Vidya Sadan" },
  tagline: { type: String, default: "Nurturing Minds, Shaping Futures" },
  description: { type: String, default: "A premier educational institution in the heart of Nepal committed to academic excellence and holistic development since 1998." },
  primaryBtn: { type: String, default: "Explore School" },
  primaryBtnHref: { type: String, default: "/about" },
  secondaryBtn: { type: String, default: "View Notices" },
  secondaryBtnHref: { type: String, default: "/notices" },
  badge: { type: String, default: "Established 1998 · Kathmandu, Nepal" },
}, { timestamps: true });

// HeroSlide — each slide is a separate document
export interface IHeroSlide extends Document {
  image: string;
  fileId: string;   // ImageKit fileId for deletion
  alt: string;
  active: boolean;
  order: number;
}

const HeroSlideSchema = new Schema<IHeroSlide>({
  image: { type: String, required: true },
  fileId: { type: String, default: "" },
  alt: { type: String, default: "School photo" },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const HeroConfigModel = mongoose.models.HeroConfig ||
  mongoose.model<IHeroConfig>("HeroConfig", HeroConfigSchema);

export const HeroSlideModel = mongoose.models.HeroSlide ||
  mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
