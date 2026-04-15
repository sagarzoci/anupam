import Link from "next/link";
import { NEWS_POSTS } from "@/lib/data";
import NewsCard from "@/components/NewsCard";

export default function NewsSection() {
  const latestPosts = NEWS_POSTS.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
              Latest Updates
            </span>
            <h2 className="section-title text-left mb-1">News & Notices</h2>
            <p className="text-gray-400 text-sm">Stay updated with school announcements and events.</p>
          </div>
          <Link
            href="/notices"
            className="flex-shrink-0 inline-flex items-center gap-2 text-blue-700 font-semibold text-sm border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-200"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <NewsCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              category={post.category}
              date={post.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
