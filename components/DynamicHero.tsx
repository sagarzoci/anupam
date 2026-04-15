import Link from "next/link";
import Image from "next/image";
import type { HeroData } from "@/lib/storage";
import { STATS } from "@/lib/data";

export default function DynamicHero({ hero }: { hero: HeroData }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Layered gradient background ── */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Animated mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-blue-500/20 blur-[120px] animate-float" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[100px]"
          style={{ animationDelay: "2s", animation: "float 8s ease-in-out infinite" }} />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-400/10 blur-[80px]"
          style={{ animationDelay: "1s", animation: "float 10s ease-in-out infinite" }} />

        {/* Dot grid pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Diagonal light streak */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent transform rotate-12 scale-150" />
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent transform rotate-12 scale-150" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-blue-200 text-sm font-medium mb-7 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {hero.badge}
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5 tracking-tight">
              {hero.schoolName.split(" ").slice(0, 1).join(" ")}{" "}
              <span className="block bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent">
                {hero.schoolName.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="text-blue-200/90 text-xl font-light mb-4 tracking-wide italic">
              {hero.tagline}
            </p>
            <p className="text-blue-100/70 text-base leading-relaxed mb-10 max-w-lg">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                href={hero.primaryBtnHref}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-800 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                {hero.primaryBtn}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={hero.secondaryBtnHref}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-200 text-sm backdrop-blur-sm"
              >
                {hero.secondaryBtn}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center hover:bg-white/12 transition-colors">
                  <div className="text-2xl mb-1.5">{stat.icon}</div>
                  <div className="font-serif font-bold text-2xl text-white leading-none">{stat.value}</div>
                  <div className="text-blue-200/60 text-[11px] mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – image */}
          <div className="hidden lg:flex justify-center">
            <div className="relative animate-float">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-400/30 to-indigo-600/30 blur-2xl scale-110" />

              <div className="relative w-[440px] h-[540px] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_32px_80px_rgba(0,0,20,0.5)]">
                <Image
                  src={hero.slides?.[0]?.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=800&fit=crop"}
                  alt={`${hero.schoolName} campus`}
                  fill
                  className="object-cover"
                  priority
                  sizes="440px"
                />
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-10 bg-white rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🏆</div>
                <div>
                  <div className="font-bold text-navy-800 text-sm">99% Pass Rate</div>
                  <div className="text-gray-400 text-xs">SEE 2081 Results</div>
                </div>
              </div>

              <div className="absolute -top-5 -right-6 bg-amber-400 rounded-2xl px-4 py-3 shadow-lg text-center">
                <div className="font-serif font-bold text-navy-900 text-2xl leading-none">25+</div>
                <div className="text-navy-800 text-[10px] font-semibold leading-tight mt-1">Years of<br />Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 70L1440 70L1440 25C1320 58 1200 70 1080 58C960 46 840 0 720 0C600 0 480 46 360 58C240 70 120 58 0 25V70Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
