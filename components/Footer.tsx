import Link from "next/link";
import type { SiteSettings } from "@/lib/storage";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-footer-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">A</span>
              </div>
              <div>
                <div className="font-serif font-bold text-white text-lg leading-none">{settings.name}</div>
                <div className="text-blue-300 text-xs mt-1">Excellence in Education</div>
              </div>
            </div>
            <p className="text-blue-100/70 text-sm leading-relaxed mb-6 max-w-sm">
              A premier educational institution in Kathmandu dedicated to nurturing curious, confident, and compassionate students since {settings.estYear}.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: settings.social.facebook, icon: "f" },
                { href: settings.social.twitter, icon: "𝕏" },
                { href: settings.social.youtube, icon: "▶" },
                { href: settings.social.instagram, icon: "◎" },
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white text-sm transition-all hover:scale-110">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-white text-base mb-5 pb-2 border-b border-white/10">Quick Links</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-blue-100/70 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <span className="text-blue-400 text-xs">›</span>{link.label}
                  </Link>
                </li>
              ))}
              <li><Link href="/admin/login" className="text-blue-100/70 hover:text-white text-sm transition-colors flex items-center gap-2"><span className="text-blue-400 text-xs">›</span>Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-white text-base mb-5 pb-2 border-b border-white/10">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 text-blue-100/70"><span className="flex-shrink-0">📍</span><span>{settings.address}</span></li>
              <li><a href={`tel:${settings.phone}`} className="flex gap-3 text-blue-100/70 hover:text-white transition-colors"><span>📞</span>{settings.phone}</a></li>
              <li><a href={`mailto:${settings.email}`} className="flex gap-3 text-blue-100/70 hover:text-white transition-colors break-all"><span className="flex-shrink-0">✉️</span><span>{settings.email}</span></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-100/40">
          <span>© {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
          <span>Designed with ♥ in Nepal</span>
        </div>
      </div>
    </footer>
  );
}
