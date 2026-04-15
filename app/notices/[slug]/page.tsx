import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNewsBySlug, getNews, getSettings } from "@/lib/storage";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [post, allPosts, settings] = await Promise.all([
    getNewsBySlug(slug),
    getNews(),
    getSettings(),
  ]);

  if (!post || !post.published) notFound();

  const related = allPosts
    .filter(p => p.slug !== slug && p.published && p.category === post.category)
    .slice(0, 2);
  const sidebar = related.length > 0
    ? related
    : allPosts.filter(p => p.slug !== slug && p.published).slice(0, 2);

  return (
    <>
      <Navbar settings={settings} />
      <main>
        {/* Header */}
        <section className="bg-hero-gradient pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-blue-200/70 text-xs mb-5">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/notices" className="hover:text-white transition-colors">Notices</Link>
              <span>/</span>
              <span className="text-white/80 truncate max-w-[200px]">{post.title}</span>
            </div>
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 text-white text-xs font-semibold rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-200/80 text-sm">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Main content */}
              <div className="lg:col-span-2">
                {post.image && (
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-card mb-8">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width:1024px) 100vw, 66vw"
                    />
                  </div>
                )}
                <article className="bg-white rounded-2xl shadow-card p-7 md:p-10">
                  <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium border-l-4 border-blue-600 pl-5 italic">
                    {post.excerpt}
                  </p>
                  <div className="prose-school" dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
                <div className="bg-white rounded-2xl shadow-card p-5 mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">Share this post:</span>
                  <div className="flex gap-2">
                    {["Facebook", "Twitter", "WhatsApp"].map(platform => (
                      <a
                        key={platform}
                        href="#"
                        className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-600 rounded-lg transition-all"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <Link
                  href="/notices"
                  className="flex items-center gap-2 text-blue-700 text-sm font-semibold hover:gap-3 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Back to All Notices
                </Link>

                {sidebar.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <h3 className="font-serif font-bold text-navy-800 text-base mb-5 pb-3 border-b border-gray-100">
                      Related Posts
                    </h3>
                    <div className="space-y-5">
                      {sidebar.map(rel => (
                        <Link key={rel.id} href={`/notices/${rel.slug}`} className="flex gap-3 group">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {rel.image && (
                              <Image
                                src={rel.image}
                                alt={rel.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform"
                                sizes="64px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                              {rel.category}
                            </span>
                            <h4 className="text-navy-800 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                              {rel.title}
                            </h4>
                            <p className="text-gray-400 text-[11px] mt-1">{rel.date}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-card p-5">
                  <h3 className="font-serif font-bold text-navy-800 text-base mb-4 pb-3 border-b border-gray-100">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Events", "Academics", "Notice", "Achievements", "Infrastructure", "Faculty"].map(cat => (
                      <Link
                        key={cat}
                        href="/notices"
                        className="px-3 py-1.5 bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-600 text-xs font-semibold rounded-xl transition-all"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
