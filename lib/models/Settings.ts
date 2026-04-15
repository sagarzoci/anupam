import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  // School info
  name: string;
  estYear: number;
  address: string;
  phone: string;
  email: string;
  website: string;
  social: { facebook: string; twitter: string; youtube: string; instagram: string };
  // SEO
  metaTitle: string;
  metaDescription: string;
  // Branding
  logo: string;
  logoFileId: string;
  favicon: string;
  faviconFileId: string;
  // Principal
  principalName: string;
  principalTitle: string;
  principalImage: string;
  principalImageFileId: string;
  principalQuote: string;
  principalMessage: string;
  // About page
  aboutIntro: string;
  aboutMission: string;
  aboutVision: string;
  // Contact page
  contactEmail: string;           // email displayed + used to receive form submissions
  officeHoursWeekday: string;     // e.g. "9:00 AM – 4:00 PM"
  officeHoursSaturday: string;    // e.g. "9:00 AM – 12:00 PM"
  mapEmbedUrl: string;            // Google Maps embed src URL
  contactFormActive: boolean;     // toggle to enable/disable the contact form
}

const SettingsSchema = new Schema<ISettings>({
  name: { type: String, default: "Anupam Vidya Sadan" },
  estYear: { type: Number, default: 1998 },
  address: { type: String, default: "Lazimpat, Kathmandu, Bagmati Province, Nepal" },
  phone: { type: String, default: "+977-01-4412345" },
  email: { type: String, default: "info@anupamvidyasadan.edu.np" },
  website: { type: String, default: "www.anupamvidyasadan.edu.np" },
  social: {
    facebook: { type: String, default: "https://facebook.com" },
    twitter: { type: String, default: "https://twitter.com" },
    youtube: { type: String, default: "https://youtube.com" },
    instagram: { type: String, default: "https://instagram.com" },
  },
  metaTitle: { type: String, default: "Anupam Vidya Sadan – Excellence in Education, Kathmandu" },
  metaDescription: { type: String, default: "Premier school in Kathmandu, Nepal." },
  logo: { type: String, default: "" },
  logoFileId: { type: String, default: "" },
  favicon: { type: String, default: "" },
  faviconFileId: { type: String, default: "" },
  principalName: { type: String, default: "Dr. Sunita Shrestha" },
  principalTitle: { type: String, default: "Principal & Founder" },
  principalImage: { type: String, default: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" },
  principalImageFileId: { type: String, default: "" },
  principalQuote: { type: String, default: "Education is not the filling of a bucket, but the lighting of a fire." },
  principalMessage: { type: String, default: "With more than two decades of experience in shaping young minds, our school stands as a beacon of quality education rooted in Nepali values." },
  aboutIntro: { type: String, default: "Anupam Vidya Sadan was founded in 1998 with a belief that every child deserves world-class education rooted in Nepali values." },
  aboutMission: { type: String, default: "To provide every student with a rigorous, balanced, and inspiring education that cultivates intellectual curiosity, moral integrity, and the confidence to contribute meaningfully to society." },
  aboutVision: { type: String, default: "To be Nepal's most trusted and transformative school — where every student discovers their potential and learning ignites a lifelong passion for growth." },
  // Contact page fields
  contactEmail: { type: String, default: "" },
  officeHoursWeekday: { type: String, default: "9:00 AM – 4:00 PM" },
  officeHoursSaturday: { type: String, default: "9:00 AM – 12:00 PM" },
  mapEmbedUrl: { type: String, default: "" },
  contactFormActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
