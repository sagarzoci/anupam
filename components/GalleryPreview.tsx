import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/lib/storage";

export default function GalleryPreview({ images }: { images: GalleryItem[] }) {
  if (images.length === 0) return null;
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">Photo Gallery</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800 mb-1">Life at Our School</h2>
            <p className="text-gray-400 text-sm">Glimpses of our vibrant school community.</p>
          </div>
          <Link href="/gallery" className="flex-shrink-0 inline-flex items-center gap-2 text-blue-700 font-semibold text-sm border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all">
            Full Gallery
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className={`relative overflow-hidden rounded-2xl group cursor-pointer ${idx === 0 ? "md:col-span-2 md:row-span-2" : ""}`} style={{ height: idx === 0 ? undefined : "160px" }}>
              <div className={idx === 0 ? "h-64 md:h-full md:min-h-[336px]" : "h-full"}>
                <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-all duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
