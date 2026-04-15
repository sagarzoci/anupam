import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacilitiesSection from "@/components/FacilitiesSection";
import { getSettings } from "@/lib/storage";
import { STATS, VALUES } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `About Us | ${s.name}`,
    description: `Learn about ${s.name}'s history, mission, vision, and values.`,
  };
}

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main>
        {/* Page Header */}
        <section className="bg-hero-gradient pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 border border-white/20">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              About {settings.name}
            </h1>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-base leading-relaxed">
              A journey of over {new Date().getFullYear() - settings.estYear}+ years dedicated to shaping the minds and hearts of Nepal&apos;s next generation.
            </p>
          </div>
        </section>

        {/* School Introduction */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
                  Who We Are
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800 mb-5">
                  Building Bright Futures Since {settings.estYear}
                </h2>
                {/* Live about intro from settings */}
                <p className="text-gray-500 leading-relaxed mb-6">{settings.aboutIntro}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center p-4 bg-blue-50 rounded-2xl">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="font-serif font-bold text-navy-800 text-xl">{s.value}</div>
                      <div className="text-gray-400 text-xs leading-tight mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-80 md:h-[440px] rounded-[2rem] overflow-hidden shadow-card-hover">
                <Image
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=900&fit=crop"
                  alt={`${settings.name} campus`}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
                Our Purpose
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800">Mission &amp; Vision</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-card p-8 border-t-4 border-blue-600">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md">🎯</div>
                <h3 className="font-serif font-bold text-navy-800 text-2xl mb-4">Our Mission</h3>
                {/* Live mission from settings */}
                <p className="text-gray-500 leading-relaxed">{settings.aboutMission}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-card p-8 border-t-4 border-indigo-600">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md">🌟</div>
                <h3 className="font-serif font-bold text-navy-800 text-2xl mb-4">Our Vision</h3>
                {/* Live vision from settings */}
                <p className="text-gray-500 leading-relaxed">{settings.aboutVision}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principal Message */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
                Leadership
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800">Principal&apos;s Message</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center md:items-start">
                <div className="flex-shrink-0 text-center">
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-card mx-auto mb-3">
                    <Image
                      src={settings.principalImage}
                      alt={settings.principalName}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>
                  <div className="font-serif font-bold text-navy-800">{settings.principalName}</div>
                  <div className="text-blue-600 text-xs font-medium">{settings.principalTitle}</div>
                </div>
                <div>
                  <p className="text-navy-700 font-serif text-xl italic leading-relaxed mb-4 border-l-4 border-blue-600 pl-5">
                    {settings.principalQuote}
                  </p>
                  <p className="text-gray-500 leading-relaxed">{settings.principalMessage}</p>
                  <p className="mt-5 font-serif font-bold text-navy-800">— {settings.principalName}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* School Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
                What We Stand For
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map(v => (
                <div key={v.title} className="bg-white rounded-2xl shadow-card p-6 text-center hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-serif font-bold text-navy-800 text-lg mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FacilitiesSection />
      </main>
      <Footer settings={settings} />
    </>
  );
}
