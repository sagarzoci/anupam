"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import type { SiteSettings, NewsPost } from "@/lib/storage";

const CATS = ["All","Events","Academics","Notice","Achievements","Infrastructure","Faculty"];

export default function NoticesPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/content/settings", { cache: "no-store" }).then(r => r.json()).then(setSettings);
    fetch("/api/content/news", { cache: "no-store" }).then(r => r.json()).then((all: NewsPost[]) =>
      setPosts(all.filter(p => p.published))
    );
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!settings) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" /></div>;

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <section className="bg-hero-gradient pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 border border-white/20">Updates</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">News & Notices</h1>
            <p className="text-blue-100/80 max-w-xl mx-auto">Important announcements, school news, events, and academic updates.</p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-card p-5 mb-10 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search news and notices..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all" />
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-200" />
              <div className="flex gap-2 flex-wrap justify-center">
                {CATS.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeCategory === cat ? "bg-blue-700 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-700"}`}>{cat}</button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">Found <span className="font-semibold text-navy-700">{filtered.length}</span> post{filtered.length !== 1 ? "s" : ""}</p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(post => (
                  <NewsCard key={post.id} slug={post.slug} title={post.title} excerpt={post.excerpt} image={post.image} category={post.category} date={post.date} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-card">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="font-serif font-semibold text-navy-800 text-xl mb-2">No results found</h3>
                <p className="text-gray-400 text-sm mb-4">Try a different search term or category.</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors">Clear Filters</button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
