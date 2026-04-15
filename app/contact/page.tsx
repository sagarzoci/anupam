"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { SiteSettings } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  // Honeypot ref — rendered but hidden; bots fill it, humans don't
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content/settings", { cache: "no-store" })
      .then(r => r.json())
      .then(setSettings);
  }, []);

  // ── Client-side validation (mirrors server validation) ──────────────────
  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = "Full name must be at least 2 characters.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (form.phone && form.phone.length > 30)
      e.phone = "Phone number is too long.";
    if (!form.subject.trim() || form.subject.trim().length < 3)
      e.subject = "Subject must be at least 3 characters.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // honeypot field — bots fill this, humans leave it blank
          website: honeypotRef.current?.value ?? "",
        }),
      });

      const data = await res.json() as {
        success?: boolean;
        error?: string;
        errors?: FieldErrors;
      };

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function setField(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      // Clear field error on change
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
      </div>
    );
  }

  const displayEmail = settings.contactEmail || settings.email;

  return (
    <>
      <Navbar settings={settings} />
      <main>
        {/* Page header */}
        <section className="bg-hero-gradient pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 border border-white/20">
              Get In Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-blue-100/80 max-w-xl mx-auto">
              Have a question? Our team is happy to help.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">

              {/* ── Contact info ── */}
              <div className="space-y-5">
                {[
                  { icon: "📍", title: "Address", detail: settings.address, color: "bg-blue-100" },
                  { icon: "📞", title: "Phone", detail: settings.phone, color: "bg-green-100" },
                  { icon: "✉️", title: "Email", detail: displayEmail, color: "bg-violet-100" },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800 text-sm mb-0.5">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}

                {/* Office hours */}
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <p className="font-semibold text-navy-800 text-sm mb-3">Office Hours</p>
                  <div className="space-y-1.5 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Sun – Fri</span>
                      <span className="font-medium text-navy-700">
                        {settings.officeHoursWeekday || "9:00 AM – 4:00 PM"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium text-navy-700">
                        {settings.officeHoursSaturday || "9:00 AM – 12:00 PM"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Google Maps embed */}
                {settings.mapEmbedUrl && (
                  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <iframe
                      src={settings.mapEmbedUrl}
                      width="100%"
                      height="200"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border-0 w-full"
                      title="School location map"
                    />
                  </div>
                )}
              </div>

              {/* ── Contact form ── */}
              <div className="lg:col-span-2">
                {status === "success" ? (
                  <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-serif font-bold text-navy-800 text-2xl mb-2">Message Sent!</h3>
                    <p className="text-gray-500 mb-2">
                      Thank you for reaching out. We will get back to you within 1–2 business days.
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      A confirmation email has been sent to your inbox.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-blue-700 text-blue-700 font-semibold rounded-xl hover:bg-blue-700 hover:text-white transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-card p-7 md:p-10">
                    <h3 className="font-serif font-bold text-navy-800 text-xl mb-6">
                      Send Us a Message
                    </h3>

                    {/* Server error banner */}
                    {status === "error" && serverError && (
                      <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-600">
                        <span className="text-base flex-shrink-0">⚠️</span>
                        {serverError}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      {/* Honeypot — hidden from humans, invisible via CSS not display:none */}
                      <div
                        aria-hidden="true"
                        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                      >
                        <label htmlFor="website_hp">Website</label>
                        <input
                          ref={honeypotRef}
                          id="website_hp"
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {/* Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.fullName}
                            onChange={setField("fullName")}
                            placeholder="Your full name"
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${errors.fullName ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={setField("email")}
                            placeholder="your@email.com"
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone + Subject */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={setField("phone")}
                            placeholder="+977-98XXXXXXXX"
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.subject}
                            onChange={setField("subject")}
                            placeholder="e.g. Admission enquiry"
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${errors.subject ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                          />
                          {errors.subject && (
                            <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={5}
                          value={form.message}
                          onChange={setField("message")}
                          placeholder="Write your message here..."
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-400 text-right">
                          {form.message.length}/5000
                        </p>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        {status === "submitting" ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-gray-400">
                        By submitting this form, you agree to our privacy policy. We never share your data.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
