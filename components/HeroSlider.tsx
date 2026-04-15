"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroData } from "@/lib/storage";
import { STATS } from "@/lib/data";

export default function HeroSlider({ hero }: { hero: HeroData }) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slides = hero.slides?.length > 0 ? hero.slides : [{ image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=800&fit=crop", fileId: "", alt: "School", active: true, order: 0 }];

  const go = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, slides.length, go]);
  const next = useCallback(() => go((current + 1) % slides.length), [current, slides.length, go]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Slides ── */}
      <div className="absolute inset-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={idx === 0}
              sizes="100vw"
            />
          </div>
        ))}
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-900/60 to-navy-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
      </div>

      {/* Background mesh blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-blue-100 text-xs font-semibold mb-6 backdrop-blur-sm tracking-widest uppercase">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            {hero.badge}
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4 tracking-tight drop-shadow-lg">
            {hero.schoolName}
          </h1>

          {/* Tagline */}
          <p className="text-blue-200 text-xl font-light mb-4 tracking-wide">
            {hero.tagline}
          </p>

          {/* Description */}
          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-lg">
            {hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href={hero.primaryBtnHref}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-navy-900 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              {hero.primaryBtn}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={hero.secondaryBtnHref}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/15 hover:border-white/70 transition-all duration-200 text-sm backdrop-blur-sm"
            >
              {hero.secondaryBtn}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="font-serif font-bold text-2xl text-white leading-none">{stat.value}</div>
                <div className="text-blue-200/60 text-[10px] mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Arrow Controls ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dot Indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              className={`rounded-full transition-all duration-300 ${idx === current ? "w-8 h-2.5 bg-cyan-400" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter ── */}
      {slides.length > 1 && (
        <div className="absolute top-24 right-6 z-20 text-white/50 text-xs font-mono">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      )}

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1320 50 1200 60 1080 50C960 40 840 0 720 0C600 0 480 40 360 50C240 60 120 50 0 20V60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
