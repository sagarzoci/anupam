import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoticePopup from "@/components/NoticePopup";
import PrincipalSection from "@/components/PrincipalSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GalleryPreview from "@/components/GalleryPreview";
import HeroSlider from "@/components/HeroSlider";
import DynamicQuickLinks from "@/components/DynamicQuickLinks";
import DynamicNewsSection from "@/components/DynamicNewsSection";
import {
  getHero,
  getSettings,
  getActivePopupNotice,
  getQuickLinks,
  getNews,
  getGallery,
  seedIfEmpty,
} from "@/lib/storage";

// Force every request to re-run this server component — no caching at all
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    await seedIfEmpty();
    const s = await getSettings();
    return {
      title: s.metaTitle,
      description: s.metaDescription,
      icons: s.favicon ? { icon: s.favicon } : undefined,
    };
  } catch {
    return { title: "Anupam Vidya Sadan" };
  }
}

export default async function HomePage() {
  await seedIfEmpty();

  const [hero, settings, popup, quickLinks, news, gallery] = await Promise.all([
    getHero(),
    getSettings(),
    getActivePopupNotice(),
    getQuickLinks(),
    getNews(),
    getGallery(),
  ]);

  const publishedNews = news.filter(n => n.published).slice(0, 3);
  const activeLinks = quickLinks.filter(l => l.active);
  const previewGallery = gallery.slice(0, 8);

  return (
    <>
      <Navbar settings={settings} />
      {popup && <NoticePopup popup={popup} />}
      <main>
        <HeroSlider hero={hero} />
        <PrincipalSection settings={settings} />
        <FacilitiesSection />
        <DynamicQuickLinks links={activeLinks} />
        <DynamicNewsSection posts={publishedNews} />
        <GalleryPreview images={previewGallery} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
