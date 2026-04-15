"use client";
import type { QuickLink } from "@/lib/storage";

const GRADIENT_COLORS = [
  "from-blue-600 to-blue-700",
  "from-indigo-600 to-violet-700",
  "from-teal-600 to-cyan-700",
  "from-rose-600 to-pink-700",
];

function normalizeHref(url?: string) {
  const value = (url ?? "").trim();
  if (!value || value === "#") return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("/") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }
  return `https://${value}`;
}

export default function DynamicQuickLinks({ links }: { links: QuickLink[] }) {
  if (links.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
            Digital Access
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800 mb-2">
            Quick Access Portals
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Seamless digital tools for students, parents, and educators.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 gap-6 ${
            links.length === 2
              ? "md:grid-cols-2 max-w-2xl mx-auto"
              : links.length >= 3
                ? "md:grid-cols-3"
                : ""
          }`}
        >
          {links.map((link, idx) => {
            const gradient = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
            const href = normalizeHref(link.url);
            const isExternal = /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
            const classes = "group card p-7 flex flex-col items-start hover:-translate-y-1 transition-all duration-300";
            const inner = (
              <>
                <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
                  {link.badge}
                </span>
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl mb-5 shadow-md group-hover:shadow-lg transition-shadow`}
                >
                  {link.icon}
                </div>
                <h3 className="font-serif font-bold text-navy-800 text-xl mb-2 group-hover:text-blue-700 transition-colors">
                  {link.label}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {link.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                  Access Portal
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </>
            );

            if (!href) {
              return (
                <div
                  key={link.id ?? idx}
                  className={`${classes} opacity-70 cursor-not-allowed`}
                  aria-disabled="true"
                >
                  {inner}
                </div>
              );
            }

            return (
              <a
                key={link.id ?? idx}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={classes}
              >
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
