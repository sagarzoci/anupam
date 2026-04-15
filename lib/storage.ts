import connectDB from "./db";
import SettingsModel from "./models/Settings";
import { HeroConfigModel, HeroSlideModel } from "./models/Hero";
import PopupNoticeModel from "./models/Popup";
import QuickLinkModel from "./models/QuickLink";
import NewsModel from "./models/News";
import GalleryModel from "./models/Gallery";
import { deleteFromImageKit } from "./imagekit";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SiteSettings = {
  _id?: string; name: string; estYear: number; address: string;
  phone: string; email: string; website: string;
  social: { facebook: string; twitter: string; youtube: string; instagram: string };
  metaTitle: string; metaDescription: string;
  logo: string; logoFileId: string;
  favicon: string; faviconFileId: string;
  principalName: string; principalTitle: string;
  principalImage: string; principalImageFileId: string;
  principalQuote: string; principalMessage: string;
  aboutIntro: string; aboutMission: string; aboutVision: string;
  // Contact page
  contactEmail: string;
  officeHoursWeekday: string;
  officeHoursSaturday: string;
  mapEmbedUrl: string;
  contactFormActive: boolean;
};

export type HeroConfig = {
  _id?: string; schoolName: string; tagline: string; description: string;
  primaryBtn: string; primaryBtnHref: string; secondaryBtn: string;
  secondaryBtnHref: string; badge: string;
};

export type HeroSlide = {
  _id?: string; id?: string;
  image: string; fileId: string; alt: string; active: boolean; order: number;
};

export type HeroData = HeroConfig & { slides: HeroSlide[] };

export type PopupNotice = {
  _id?: string; id?: string;
  title: string; subtitle: string; badge: string; body: string;
  image: string; fileId: string; tags: string[];
  primaryBtnText: string; primaryBtnHref: string;
  active: boolean; order: number; createdAt?: string;
};

export type QuickLink = {
  _id?: string; id?: string;
  label: string; description: string; url: string; icon: string;
  badge: string; active: boolean; order: number;
};

export type NewsPost = {
  _id?: string; id?: string; slug: string; title: string; excerpt: string;
  content: string; image: string; category: string; date: string;
  author: string; published: boolean; createdAt?: string;
};

export type GalleryItem = {
  _id?: string; id?: string; src: string; fileId: string; alt: string; category: string;
};

function lean<T>(doc: unknown): T {
  const obj = JSON.parse(JSON.stringify(doc));
  if (obj && obj._id) obj.id = obj._id.toString();
  return obj as T;
}

// ─── Seed default data ────────────────────────────────────────────────────────
export async function seedIfEmpty() {
  await connectDB();
  const [hasSettings, hasHeroConfig, hasPopup, slideCount, linkCount, newsCount, galleryCount] = await Promise.all([
    SettingsModel.findOne().select("_id").lean(),
    HeroConfigModel.findOne().select("_id").lean(),
    PopupNoticeModel.findOne().select("_id").lean(),
    HeroSlideModel.countDocuments(),
    QuickLinkModel.countDocuments(),
    NewsModel.countDocuments(),
    GalleryModel.countDocuments(),
  ]);

  const seeds: Promise<unknown>[] = [];

  if (!hasSettings) seeds.push(SettingsModel.create({}));
  if (!hasHeroConfig) seeds.push(HeroConfigModel.create({}));

  if (slideCount === 0) {
    seeds.push(HeroSlideModel.insertMany([
      { image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=800&fit=crop", fileId: "", alt: "School Building", active: true, order: 0 },
      { image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&h=800&fit=crop", fileId: "", alt: "Students in Classroom", active: true, order: 1 },
      { image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&h=800&fit=crop", fileId: "", alt: "Annual Sports Day", active: true, order: 2 },
    ]));
  }

  if (!hasPopup) {
    seeds.push(PopupNoticeModel.create({
      title: "Admission Open for the New Academic Session",
      subtitle: "FEATURED SCHOOL UPDATE",
      badge: "IMPORTANT NOTICE",
      body: "Explore admission details, important dates, and school updates from Anupam Vidya Sadan.",
      image: "", fileId: "",
      tags: ["Admission Updates", "Important Dates", "School Announcements"],
      primaryBtnText: "View Notice", primaryBtnHref: "/notices",
      active: true, order: 0,
    }));
  }

  if (linkCount === 0) {
    seeds.push(QuickLinkModel.insertMany([
      { label: "ERP Portal", description: "Access fee management, student records, attendance, and reports.", url: "https://nervous-carson-f39e40.netlify.app/", icon: "🗂️", badge: "Management System", active: true, order: 0 },
      { label: "LMS Platform", description: "Digital learning resources, assignments, e-books, and course materials.", url: "https://sara-school.netlify.app/", icon: "📚", badge: "Learning Platform", active: true, order: 1 },
      { label: "Online Classes", description: "Live and recorded online classes accessible from anywhere, anytime.", url: "https://anupam.edu.np/online_class", icon: "🎓", badge: "Virtual Classroom", active: true, order: 2 },
    ]));
  }

  if (newsCount === 0) {
    seeds.push(NewsModel.insertMany([
      { slug: "annual-sports-day-2024", title: "Annual Sports Day 2081 – A Day of Champions", excerpt: "Students from all grades competed with great spirit in this year's Annual Sports Day.", content: "<p>Anupam Vidya Sadan held its Annual Sports Day on Falgun 20, 2081.</p>", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop", category: "Events", date: "Falgun 20, 2081", author: "School Administration", published: true },
      { slug: "board-exam-results-2081", title: "Outstanding SEE Results – 98% Distinction Pass Rate", excerpt: "Our Grade 10 students achieved outstanding SEE results.", content: "<p>98% distinction pass rate — our highest ever.</p>", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop", category: "Academics", date: "Ashadh 10, 2081", author: "Exam Department", published: true },
      { slug: "new-science-lab", title: "New Digital Science Laboratory Inaugurated", excerpt: "The school proudly opens its brand-new digital science laboratory.", content: "<p>Modern science lab with digital microscopes and smart boards.</p>", image: "https://images.unsplash.com/photo-1532094349884-543559196e14?w=800&h=500&fit=crop", category: "Infrastructure", date: "Baisakh 5, 2081", author: "School Administration", published: true },
      { slug: "admission-open-2082", title: "Admission Open for Academic Year 2081/82", excerpt: "Applications are now open for all grades.", content: "<p>Anupam Vidya Sadan invites applications for 2081/82.</p>", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop", category: "Notice", date: "Chaitra 1, 2081", author: "Admission Office", published: true },
    ]));
  }

  if (galleryCount === 0) {
    seeds.push(GalleryModel.insertMany([
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop", fileId: "", alt: "School Building", category: "Campus" },
      { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop", fileId: "", alt: "Sports Day", category: "Events" },
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop", fileId: "", alt: "Classroom", category: "Academic" },
      { src: "https://images.unsplash.com/photo-1532094349884-543559196e14?w=600&h=400&fit=crop", fileId: "", alt: "Science Lab", category: "Facilities" },
      { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", fileId: "", alt: "Computer Lab", category: "Facilities" },
      { src: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&h=400&fit=crop", fileId: "", alt: "Sports", category: "Sports" },
    ]));
  }

  if (seeds.length > 0) await Promise.all(seeds);
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function getSettings(): Promise<SiteSettings> {
  await connectDB();
  const doc = await SettingsModel.findOne().lean();
  return lean<SiteSettings>(doc);
}
export async function saveSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  await connectDB();
  const doc = await SettingsModel.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: false }).lean();
  return lean<SiteSettings>(doc);
}

// ─── Hero Config ──────────────────────────────────────────────────────────────
export async function getHeroConfig(): Promise<HeroConfig> {
  await connectDB();
  const doc = await HeroConfigModel.findOne().lean();
  return lean<HeroConfig>(doc);
}
export async function saveHeroConfig(data: Partial<HeroConfig>): Promise<HeroConfig> {
  await connectDB();
  const doc = await HeroConfigModel.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: false }).lean();
  return lean<HeroConfig>(doc);
}

// ─── Hero Slides (multiple documents) ────────────────────────────────────────
export async function getHeroSlides(): Promise<HeroSlide[]> {
  await connectDB();
  const docs = await HeroSlideModel.find().sort({ order: 1, createdAt: 1 }).lean();
  return docs.map(d => lean<HeroSlide>(d));
}
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  await connectDB();
  const docs = await HeroSlideModel.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
  return docs.map(d => lean<HeroSlide>(d));
}
export async function createHeroSlide(data: Omit<HeroSlide, "_id" | "id">): Promise<HeroSlide> {
  await connectDB();
  const doc = await HeroSlideModel.create(data);
  return lean<HeroSlide>(doc.toObject());
}
export async function updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<HeroSlide | null> {
  await connectDB();
  try {
    const doc = await HeroSlideModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? lean<HeroSlide>(doc) : null;
  } catch { return null; }
}
export async function deleteHeroSlide(id: string): Promise<boolean> {
  await connectDB();
  try {
    const doc = await HeroSlideModel.findById(id).lean();
    if (!doc) return false;
    const slide = lean<HeroSlide>(doc);
    await HeroSlideModel.findByIdAndDelete(id);
    if (slide.fileId) await deleteFromImageKit(slide.fileId);
    return true;
  } catch { return false; }
}

// For backward compat — homepage uses this
export async function getHero(): Promise<HeroData> {
  await connectDB();
  const [config, slides] = await Promise.all([getHeroConfig(), getActiveHeroSlides()]);
  return { ...config, slides };
}

// ─── Popup Notices ────────────────────────────────────────────────────────────
export async function getPopupNotices(): Promise<PopupNotice[]> {
  await connectDB();
  const docs = await PopupNoticeModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return docs.map(d => lean<PopupNotice>(d));
}
export async function getActivePopupNotice(): Promise<PopupNotice | null> {
  await connectDB();
  const doc = await PopupNoticeModel.findOne({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
  return doc ? lean<PopupNotice>(doc) : null;
}
export async function createPopupNotice(data: Omit<PopupNotice, "_id" | "id" | "createdAt">): Promise<PopupNotice> {
  await connectDB();
  const doc = await PopupNoticeModel.create(data);
  return lean<PopupNotice>(doc.toObject());
}
export async function updatePopupNotice(id: string, data: Partial<PopupNotice>): Promise<PopupNotice | null> {
  await connectDB();
  try {
    const doc = await PopupNoticeModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? lean<PopupNotice>(doc) : null;
  } catch { return null; }
}
export async function deletePopupNotice(id: string): Promise<boolean> {
  await connectDB();
  try {
    const doc = await PopupNoticeModel.findById(id).lean();
    if (!doc) return false;
    const notice = lean<PopupNotice>(doc);
    await PopupNoticeModel.findByIdAndDelete(id);
    if (notice.fileId) await deleteFromImageKit(notice.fileId);
    return true;
  } catch { return false; }
}

// ─── Quick Links ──────────────────────────────────────────────────────────────
export async function getQuickLinks(): Promise<QuickLink[]> {
  await connectDB();
  const docs = await QuickLinkModel.find().sort({ order: 1 }).lean();
  return docs.map(d => lean<QuickLink>(d));
}
export async function saveQuickLinks(data: QuickLink[]): Promise<void> {
  await connectDB();
  await QuickLinkModel.deleteMany({});
  if (data.length > 0) {
    await QuickLinkModel.insertMany(
      data.map((d, i) => ({
        label: d.label, description: d.description, url: d.url,
        icon: d.icon, badge: d.badge, active: d.active, order: i,
      }))
    );
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────
export async function getNews(): Promise<NewsPost[]> {
  await connectDB();
  const docs = await NewsModel.find().sort({ createdAt: -1 }).lean();
  return docs.map(d => lean<NewsPost>(d));
}
export async function getNewsById(id: string): Promise<NewsPost | null> {
  await connectDB();
  try { const doc = await NewsModel.findById(id).lean(); return doc ? lean<NewsPost>(doc) : null; }
  catch { return null; }
}
export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  await connectDB();
  const doc = await NewsModel.findOne({ slug }).lean();
  return doc ? lean<NewsPost>(doc) : null;
}
export async function createNewsPost(data: Omit<NewsPost, "_id" | "id" | "createdAt">): Promise<NewsPost> {
  await connectDB();
  const doc = await NewsModel.create(data);
  return lean<NewsPost>(doc.toObject());
}
export async function updateNewsPost(id: string, data: Partial<NewsPost>): Promise<NewsPost | null> {
  await connectDB();
  try { const doc = await NewsModel.findByIdAndUpdate(id, data, { new: true }).lean(); return doc ? lean<NewsPost>(doc) : null; }
  catch { return null; }
}
export async function deleteNewsPost(id: string): Promise<boolean> {
  await connectDB();
  try { return !!(await NewsModel.findByIdAndDelete(id)); }
  catch { return false; }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryItem[]> {
  await connectDB();
  const docs = await GalleryModel.find().sort({ createdAt: -1 }).lean();
  return docs.map(d => lean<GalleryItem>(d));
}
export async function addGalleryItem(data: Omit<GalleryItem, "_id" | "id">): Promise<GalleryItem> {
  await connectDB();
  const doc = await GalleryModel.create(data);
  return lean<GalleryItem>(doc.toObject());
}
export async function deleteGalleryItem(id: string): Promise<boolean> {
  await connectDB();
  try {
    const doc = await GalleryModel.findById(id).lean();
    if (!doc) return false;
    const item = lean<GalleryItem>(doc);
    await GalleryModel.findByIdAndDelete(id);
    if (item.fileId) await deleteFromImageKit(item.fileId);
    return true;
  } catch { return false; }
}

// ─── Contact Messages ─────────────────────────────────────────────────────────
import ContactModel from "./models/Contact";

export type ContactStatus = "unread" | "read" | "replied";

export type ContactMessage = {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  ip: string;
  createdAt?: string;
};

export async function createContactMessage(
  data: Omit<ContactMessage, "_id" | "id" | "createdAt">,
): Promise<ContactMessage> {
  await connectDB();
  const doc = await ContactModel.create(data);
  return lean<ContactMessage>(doc.toObject());
}

export async function getContactMessages(
  page = 1,
  limit = 20,
  status?: ContactStatus,
): Promise<{ messages: ContactMessage[]; total: number }> {
  await connectDB();
  const filter = status ? { status } : {};
  const [messages, total] = await Promise.all([
    ContactModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactModel.countDocuments(filter),
  ]);
  return { messages: messages.map(d => lean<ContactMessage>(d)), total };
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus,
): Promise<ContactMessage | null> {
  await connectDB();
  try {
    const doc = await ContactModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).lean();
    return doc ? lean<ContactMessage>(doc) : null;
  } catch {
    return null;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  await connectDB();
  try {
    return !!(await ContactModel.findByIdAndDelete(id));
  } catch {
    return false;
  }
}
