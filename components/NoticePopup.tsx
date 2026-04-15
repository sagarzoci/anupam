"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PopupNotice } from "@/lib/storage";

export default function NoticePopup({ popup }: { popup: PopupNotice }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const key = `avs_popup_v2_${popup._id || popup.id}`;
    if (!sessionStorage.getItem(key)) {
      const t = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(key, "1");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [popup._id, popup.id]);

  if (!isOpen) return null;

  const tags = popup.tags?.length > 0 ? popup.tags : [];
  const hasImage = !!popup.image;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.40)] overflow-hidden animate-slide-up">

        {/* ── TOP BADGE BAR (matches Image 1 green bar) ── */}
        <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-cyan-400 text-navy-900 text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm">
              {popup.badge || "IMPORTANT NOTICE"}
            </span>
            <span className="px-2 py-0.5 bg-white/25 text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
              NEW
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── NOTICE IMAGE (prominent — matches Image 1 document photo) ── */}
        {hasImage ? (
          <div className="relative w-full" style={{ height: "260px" }}>
            <Image
              src={popup.image}
              alt={popup.title}
              fill
              className="object-cover object-top"
              sizes="560px"
              priority
            />
            {/* Subtle gradient so text below transitions nicely */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
          </div>
        ) : (
          /* Decorative placeholder when no image */
          <div className="h-40 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">📢</div>
              <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest">School Notice</p>
            </div>
          </div>
        )}

        {/* ── CONTENT BODY ── */}
        <div className="px-5 pt-4 pb-5">
          {/* Subtitle */}
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
            {popup.subtitle || "FEATURED SCHOOL UPDATE"}
          </p>

          {/* Title */}
          <h2 className="font-serif text-xl font-bold text-gray-900 leading-snug mb-2">
            {popup.title}
          </h2>

          {/* Body — only show if there's text */}
          {popup.body && (
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {popup.body}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded-full hover:border-emerald-500 hover:text-emerald-700 cursor-default transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={popup.primaryBtnHref || "/notices"}
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-3 bg-cyan-400 hover:bg-cyan-300 text-navy-900 text-sm font-bold rounded-full transition-all shadow-sm hover:shadow-md"
            >
              {popup.primaryBtnText || "View Notice"}
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-600 text-sm font-semibold rounded-full transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 pb-3.5 flex items-center justify-between border-t border-gray-100 pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-2 rounded-full bg-navy-800 inline-block" />
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
          </div>
          <p className="text-[10px] text-gray-400">Refresh page to see popup again.</p>
        </div>
      </div>
    </div>
  );
}
