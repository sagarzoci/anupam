"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { SiteSettings, QuickLink } from "@/lib/storage";
import { QUICK_ACTIONS as FALLBACK_ACTIONS } from "@/lib/data";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/contact" },
];

function normalizeHref(url?: string) {
  const value = (url ?? "").trim();
  if (!value || value === "#") return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("/") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }
  return `https://${value}`;
}

function fallbackQuickLinks(): QuickLink[] {
  return FALLBACK_ACTIONS.map((item, index) => ({
    id: `fallback-${index}`,
    label: item.label,
    description: "",
    url: item.href,
    icon: item.icon,
    badge: "Portal",
    active: true,
    order: index,
  }));
}

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickLink[]>(fallbackQuickLinks());
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content/quicklinks", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load quick links");
        return res.json();
      })
      .then((data: QuickLink[]) => {
        if (cancelled) return;
        const active = Array.isArray(data) ? data.filter((item) => item?.active) : [];
        if (active.length > 0) setQuickActions(active);
      })
      .catch(() => {
        if (!cancelled) setQuickActions(fallbackQuickLinks());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const renderQuickAction = (action: QuickLink, mobile = false) => {
    const href = normalizeHref(action.url);
    const className = mobile
      ? "flex-1 py-2 text-xs font-semibold text-center text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-700 hover:text-white transition-all"
      : "px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all flex items-center gap-1.5";

    if (!href) {
      return (
        <span key={action.id ?? action.label} className={`${className} opacity-60 cursor-not-allowed`}>
          {action.icon} {action.label}
        </span>
      );
    }

    const isExternal = /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    return (
      <a
        key={action.id ?? action.label}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={className}
      >
        {action.icon} {action.label}
      </a>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/96 backdrop-blur-md shadow-nav" : "bg-white/90 backdrop-blur-sm shadow-sm"}`}>
      <div className="bg-navy-900 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-1.5">
          <span className="opacity-70">📍 {settings.address}</span>
          <div className="flex items-center gap-4 opacity-70">
            <span>📞 {settings.phone}</span>
            <span>✉️ {settings.email}</span>
          </div>
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            {settings.logo ? (
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                <Image src={settings.logo} alt={settings.name} fill className="object-contain p-1" sizes="44px" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-hero-gradient flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-serif font-bold text-xl">A</span>
              </div>
            )}
            <div>
              <div className="font-serif font-bold text-navy-800 text-sm leading-none">{settings.name}</div>
              <div className="text-xs text-gray-400 mt-0.5 hidden sm:block">Excellence in Education</div>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"}`}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {quickActions.map((action) => renderQuickAction(action))}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {mobileOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={`px-4 py-3 rounded-xl text-sm font-medium ${pathname === link.href ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
              {quickActions.map((action) => renderQuickAction(action, true))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
