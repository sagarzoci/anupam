import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/storage";

export default function PrincipalSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">About Our School</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800 mb-2">A Message from Our Principal</h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">Leading with vision, inspiring with purpose.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-blue-50 rounded-[2rem] border border-blue-100" />
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-indigo-50 rounded-[2rem] border border-indigo-100" />
              <div className="relative w-72 h-88 md:w-80 md:h-96 rounded-[1.5rem] overflow-hidden shadow-card-hover">
                <Image src={settings.principalImage} alt={settings.principalName} fill className="object-cover" sizes="320px" />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-xl px-5 py-3 shadow-card-hover text-center whitespace-nowrap border border-gray-100">
                <div className="font-serif font-bold text-navy-800 text-sm">{settings.principalName}</div>
                <div className="text-blue-600 text-xs font-medium">{settings.principalTitle}</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <blockquote className="relative">
              <div className="text-6xl text-blue-100 font-serif leading-none mb-2 select-none">"</div>
              <p className="text-navy-800 font-serif text-xl md:text-2xl italic leading-relaxed -mt-6 pl-4 border-l-4 border-blue-600">{settings.principalQuote}</p>
            </blockquote>
            <p className="text-gray-500 leading-relaxed">{settings.principalMessage}</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[["🎓","Experienced Faculty"],["🏫","Modern Facilities"],["📊","Proven Results"],["🌍","Global Perspective"]].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="text-lg">{icon}</span><span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:gap-3 transition-all group">
              Read More About Our School
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
