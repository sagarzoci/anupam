import Link from "next/link";
import type { NewsPost } from "@/lib/storage";
import NewsCard from "@/components/NewsCard";

export default function DynamicNewsSection({ posts }: { posts: NewsPost[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">Latest Updates</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800 mb-1">News & Notices</h2>
            <p className="text-gray-400 text-sm">Stay updated with school announcements and events.</p>
          </div>
          <Link href="/notices" className="flex-shrink-0 inline-flex items-center gap-2 text-blue-700 font-semibold text-sm border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-200">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} slug={post.slug} title={post.title} excerpt={post.excerpt} image={post.image} category={post.category} date={post.date} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-400">No news published yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
