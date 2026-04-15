import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Events: "bg-blue-100 text-blue-700",
  Academics: "bg-green-100 text-green-700",
  Notice: "bg-orange-100 text-orange-700",
  Achievements: "bg-amber-100 text-amber-700",
  Infrastructure: "bg-violet-100 text-violet-700",
  Faculty: "bg-teal-100 text-teal-700",
};

export default function NewsCard({ slug, title, excerpt, image, category, date, featured = false }: NewsCardProps) {
  const badgeColor = CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-600";

  return (
    <article className={`card group overflow-hidden flex flex-col ${featured ? "md:flex-row" : ""}`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "md:w-2/5 h-52 md:h-auto" : "h-48"} flex-shrink-0`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={featured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 640px) 100vw, 33vw"}
        />
        {/* Category overlay */}
        <div className="absolute top-3 left-3">
          <span className={`badge text-[11px] font-semibold shadow-sm ${badgeColor}`}>{category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </div>

        {/* Title */}
        <h3 className={`font-serif font-semibold text-navy-800 leading-snug mb-2 group-hover:text-blue-700 transition-colors ${featured ? "text-xl md:text-2xl" : "text-base"}`}>
          <Link href={`/notices/${slug}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{excerpt}</p>

        {/* Read more */}
        <Link
          href={`/notices/${slug}`}
          className="inline-flex items-center gap-1.5 text-blue-700 text-sm font-semibold mt-4 hover:gap-2.5 transition-all duration-200 group/link"
        >
          Read More
          <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
