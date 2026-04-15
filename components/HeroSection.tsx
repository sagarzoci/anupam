import Link from "next/link";
import Image from "next/image";
import { STATS } from "@/lib/data";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-24 md:py-32 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Established 1998 · Kathmandu, Nepal
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
              Anupam{" "}
              <span className="block text-gradient">Vidya Sadan</span>
            </h1>

            {/* Tagline */}
            <p className="text-blue-200 text-xl font-light mb-4 tracking-wide">
              Nurturing Minds, Shaping Futures
            </p>

            {/* Description */}
            <p className="text-blue-100/80 text-base leading-relaxed mb-8 max-w-lg">
              A premier institution in the heart of Nepal where academic brilliance meets
              character building. We prepare students not just for exams, but for life.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/about" className="btn-primary text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl">
                Explore School
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/notices" className="btn-secondary text-sm px-7 py-3.5 rounded-xl">
                View Notices
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="font-serif font-bold text-xl text-white">{stat.value}</div>
                  <div className="text-blue-200/70 text-xs mt-0.5 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="relative">
              {/* Main image frame */}
              <div className="relative w-[440px] h-[520px] rounded-[2rem] overflow-hidden shadow-hero border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=960&fit=crop"
                  alt="Anupam Vidya Sadan School Building"
                  fill
                  className="object-cover"
                  priority
                  sizes="440px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
              </div>

              {/* Floating info card */}
              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl px-5 py-4 shadow-card-hover flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🏆</div>
                <div>
                  <div className="font-semibold text-navy-800 text-sm">99% Pass Rate</div>
                  <div className="text-gray-400 text-xs">SEE 2081 Results</div>
                </div>
              </div>

              {/* Floating badge top right */}
              <div className="absolute -top-4 -right-4 bg-gold-400 rounded-2xl px-4 py-3 shadow-lg text-center">
                <div className="font-serif font-bold text-navy-900 text-lg">25+</div>
                <div className="text-navy-800 text-[10px] font-semibold">Years of<br/>Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1320 50 1200 60 1080 50C960 40 840 0 720 0C600 0 480 40 360 50C240 60 120 50 0 20V60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
