"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { SiteSettings, GalleryItem } from "@/lib/storage";

const CATS = ["All","Campus","Events","Academic","Facilities","Achievements","Sports","Faculty"];

export default function GalleryPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch("/api/content/settings", { cache: "no-store" }).then(r => r.json()).then(setSettings);
    fetch("/api/content/gallery", { cache: "no-store" }).then(r => r.json()).then(setImages);
  }, []);

  const filtered = active === "All" ? images : images.filter(i => i.category === active);

  if (!settings) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" /></div>;

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <section className="bg-hero-gradient pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 border border-white/20">Photo Gallery</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Life at Our School</h1>
            <p className="text-blue-100/80 max-w-xl mx-auto">Glimpses of learning, achievement and community.</p>
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {CATS.map(cat => (
                <button key={cat} onClick={() => setActive(cat)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${active === cat ? "bg-blue-700 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}>{cat}</button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mb-8">Showing <span className="font-semibold text-navy-700">{filtered.length}</span> photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img) => (
                <div key={img.id} className="relative h-48 md:h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-card-hover transition-shadow" onClick={() => setLightbox(img)}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />
                  <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-all flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</p>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-4">📷</div><p>No photos in this category.</p></div>}
          </div>
        </section>
      </main>
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden"><Image src={lightbox.src.replace("w=600&h=400","w=1200&h=800")} alt={lightbox.alt} fill className="object-contain" sizes="100vw" /></div>
            <p className="text-white/80 text-sm text-center mt-3">{lightbox.alt}</p>
            <button onClick={() => setLightbox(null)} className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
      <Footer settings={settings} />
    </>
  );
}
