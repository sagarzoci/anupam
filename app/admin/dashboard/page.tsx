"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

type Section =
  | "overview"
  | "hero"
  | "quicklinks"
  | "popup"
  | "news"
  | "gallery"
  | "about"
  | "contact"
  | "messages"
  | "settings"
  | "credentials";
interface Toast {
  id: number;
  msg: string;
  type: "success" | "error";
}
interface HeroSlide {
  id: string;
  image: string;
  fileId: string;
  alt: string;
  active: boolean;
  order: number;
}
interface PopupNotice {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  body: string;
  image: string;
  fileId: string;
  tags: string[];
  primaryBtnText: string;
  primaryBtnHref: string;
  active: boolean;
  order: number;
}
interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  published: boolean;
}
interface GalleryItem {
  id: string;
  src: string;
  fileId: string;
  alt: string;
  category: string;
}

// fileId-aware upload result
interface UploadedFile {
  url: string;
  fileId: string;
}

// ── API with cache-busting ────────────────────────────────────────────────────
async function api(url: string, method = "GET", body?: unknown) {
  const bust = `_t=${Date.now()}`;
  const fetchUrl =
    method === "GET" ? `${url}${url.includes("?") ? "&" : "?"}${bust}` : url;
  const res = await fetch(fetchUrl, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function ToastBar({
  toasts,
  remove,
}: {
  toasts: Toast[];
  remove: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${t.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
        >
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          <span className="flex-1">{t.msg}</span>
          <button
            onClick={() => remove(t.id)}
            className="opacity-70 hover:opacity-100 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  );
}
function SH({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl font-bold text-navy-800 mb-1">
        {title}
      </h2>
      <p className="text-gray-400 text-sm">{sub}</p>
    </div>
  );
}
function Field({
  label,
  type = "text",
  value,
  onChange,
  rows = 3,
  placeholder = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        />
      )}
    </div>
  );
}
function Toggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${active ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : ""}`}
      />
    </button>
  );
}
function Btn({
  saving,
  onClick,
  label = "Save Changes",
  variant = "primary",
}: {
  saving?: boolean;
  onClick: () => void;
  label?: string;
  variant?: "primary" | "danger";
}) {
  const cls =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-700 hover:bg-blue-800";
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`inline-flex items-center gap-2 px-5 py-2.5 ${cls} disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all`}
    >
      {saving ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Saving…
        </>
      ) : (
        <>✓ {label}</>
      )}
    </button>
  );
}
function AddByUrl({
  onAdd,
  placeholder,
}: {
  onAdd: (url: string, fileId?: string) => void;
  placeholder?: string;
}) {
  const [val, setVal] = useState("");
  const submit = () => {
    if (val.trim()) {
      onAdd(val.trim(), "");
      setVal("");
    }
  };
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder || "https://..."}
        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        onClick={submit}
        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
      >
        + Add
      </button>
    </div>
  );
}

// ImageUploader wrapper that captures fileId
function UploadField({
  onUploaded,
  label = "Upload Image",
  multiple = false,
}: {
  onUploaded: (files: UploadedFile[]) => void;
  label?: string;
  multiple?: boolean;
}) {
  return (
    <ImageUploader
      multiple={multiple}
      label={label}
      onUploaded={(urls, fileIds) => {
        const files: UploadedFile[] = urls.map((url, i) => ({
          url,
          fileId: fileIds[i] ?? "",
        }));
        onUploaded(files);
      }}
    />
  );
}

// ── HERO SLIDES (list CRUD — like notices) ────────────────────────────────────
const SLIDE_EMPTY = {
  image: "",
  fileId: "",
  alt: "School photo",
  active: true,
  order: 0,
};

function HeroSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [config, setConfig] = useState<Record<string, string> | null>(null);
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);

  const loadSlides = useCallback(() => {
    api("/api/content/hero-slides").then(setSlides);
  }, []);
  useEffect(() => {
    api("/api/content/hero").then(setConfig);
    loadSlides();
  }, [loadSlides]);

  const set = (key: string) => (val: string) =>
    setConfig((c) => (c ? { ...c, [key]: val } : c));
  const setE = (key: string) => (val: string | boolean) =>
    setEditing((e) => (e ? { ...e, [key]: val } : e));

  const saveConfig = async () => {
    setSavingConfig(true);
    try {
      await api("/api/content/hero", "PUT", config);
      toast("Hero text/buttons saved! Refresh website.");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSavingConfig(false);
    }
  };

  const saveSlide = async () => {
    if (!editing?.image) {
      toast("Image is required.", "error");
      return;
    }
    setSavingSlide(true);
    try {
      if (isNew) {
        await api("/api/content/hero-slides", "POST", editing);
        toast("Slide added!");
      } else {
        await api(`/api/content/hero-slides/${editing.id}`, "PUT", editing);
        toast("Slide updated!");
      }
      loadSlides();
      setEditing(null);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSavingSlide(false);
    }
  };

  const toggleSlide = async (s: HeroSlide) => {
    try {
      await api(`/api/content/hero-slides/${s.id}`, "PUT", {
        active: !s.active,
      });
      toast(s.active ? "Slide hidden." : "Slide activated!");
      loadSlides();
    } catch {
      toast("Update failed.", "error");
    }
  };

  const delSlide = async (id: string) => {
    if (!confirm("Delete this slide? It will also be removed from ImageKit."))
      return;
    try {
      await api(`/api/content/hero-slides/${id}`, "DELETE");
      toast("Slide deleted from MongoDB and ImageKit.");
      loadSlides();
    } catch {
      toast("Delete failed.", "error");
    }
  };

  if (!config || !slides) return <Loader />;

  return (
    <div className="space-y-6">
      <SH
        title="Hero Slider"
        sub="Manage slider images and homepage text/button content."
      />

      {/* Text config */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          Text & Buttons
        </h3>
        <Field
          label="School Name"
          value={config.schoolName || ""}
          onChange={set("schoolName")}
        />
        <Field
          label="Badge Text (small pill)"
          value={config.badge || ""}
          onChange={set("badge")}
        />
        <Field
          label="Tagline"
          value={config.tagline || ""}
          onChange={set("tagline")}
        />
        <Field
          label="Description"
          type="textarea"
          value={config.description || ""}
          onChange={set("description")}
          rows={3}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Primary Button Text"
            value={config.primaryBtn || ""}
            onChange={set("primaryBtn")}
          />
          <Field
            label="Primary Button Link"
            value={config.primaryBtnHref || ""}
            onChange={set("primaryBtnHref")}
          />
          <Field
            label="Secondary Button Text"
            value={config.secondaryBtn || ""}
            onChange={set("secondaryBtn")}
          />
          <Field
            label="Secondary Button Link"
            value={config.secondaryBtnHref || ""}
            onChange={set("secondaryBtnHref")}
          />
        </div>
        <Btn
          saving={savingConfig}
          onClick={saveConfig}
          label="Save Text & Buttons"
        />
      </div>

      {/* Slides list */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-serif font-semibold text-navy-800 text-lg">
          Slider Images ({slides.length})
        </h3>
        <button
          onClick={() => {
            setIsNew(true);
            setEditing({ ...SLIDE_EMPTY });
          }}
          className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
        >
          + Add Slide
        </button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-hero w-full max-w-lg my-4">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-serif font-bold text-navy-800">
                {isNew ? "Add New Slide" : "Edit Slide"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {editing.image && (
                <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={editing.image}
                    alt="Slide preview"
                    fill
                    className="object-cover"
                    sizes="480px"
                  />
                  <button
                    onClick={() =>
                      setEditing((e) =>
                        e ? { ...e, image: "", fileId: "" } : e,
                      )
                    }
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Paste image URL
                </p>
                <AddByUrl
                  onAdd={(url) =>
                    setEditing((e) =>
                      e ? { ...e, image: url, fileId: "" } : e,
                    )
                  }
                  placeholder="https://...photo.jpg"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Or upload from device
                </p>
                <UploadField
                  onUploaded={(files) =>
                    setEditing((e) =>
                      e
                        ? {
                            ...e,
                            image: files[0]?.url || "",
                            fileId: files[0]?.fileId || "",
                          }
                        : e,
                    )
                  }
                  label="Upload Slide Image"
                />
              </div>
              <Field
                label="Caption / Alt Text"
                value={editing.alt || ""}
                onChange={setE("alt")}
                placeholder="e.g. Annual Prize Distribution Ceremony"
              />
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Toggle
                    active={!!editing.active}
                    onChange={() => setE("active")(!editing.active)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {editing.active ? "Visible in slider" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <Btn
                    saving={savingSlide}
                    onClick={saveSlide}
                    label={isNew ? "Add Slide" : "Update Slide"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slides grid */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {slides.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-3">🖼️</div>
            <p>No slides yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="relative rounded-xl overflow-hidden border border-gray-200 group"
              >
                <div className="relative h-36 bg-gray-100">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditing({ ...s });
                      }}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-sm shadow hover:bg-blue-50"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => delSlide(s.id)}
                      className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shadow hover:bg-red-600"
                    >
                      🗑
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Slide {idx + 1}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-600 truncate flex-1">
                    {s.alt}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-gray-400">
                      {s.active ? "Live" : "Off"}
                    </span>
                    <Toggle active={s.active} onChange={() => toggleSlide(s)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
        💡 <strong>Deleting a slide</strong> removes it from MongoDB{" "}
        <em>and</em> deletes the file from ImageKit automatically.
      </div>
    </div>
  );
}

// ── POPUP NOTICES ─────────────────────────────────────────────────────────────
const POPUP_EMPTY = {
  title: "",
  subtitle: "FEATURED SCHOOL UPDATE",
  badge: "IMPORTANT NOTICE",
  body: "",
  image: "",
  fileId: "",
  tags: [] as string[],
  primaryBtnText: "View Notice",
  primaryBtnHref: "/notices",
  active: true,
  order: 0,
};

function PopupSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [notices, setNotices] = useState<PopupNotice[] | null>(null);
  const [editing, setEditing] = useState<Partial<PopupNotice> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const load = useCallback(() => {
    api("/api/content/popup").then(setNotices);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...POPUP_EMPTY });
    setTagInput("");
  };
  const openEdit = (n: PopupNotice) => {
    setIsNew(false);
    setEditing({ ...n });
    setTagInput("");
  };
  const close = () => {
    setEditing(null);
    setIsNew(false);
  };
  const setE = (key: string) => (val: unknown) =>
    setEditing((e) => (e ? { ...e, [key]: val } : e));

  const addTag = () => {
    if (!tagInput.trim()) return;
    setE("tags")([...((editing?.tags as string[]) || []), tagInput.trim()]);
    setTagInput("");
  };
  const removeTag = (i: number) => {
    const t = [...((editing?.tags as string[]) || [])];
    t.splice(i, 1);
    setE("tags")(t);
  };

  const save = async () => {
    if (!editing?.title) {
      toast("Title is required.", "error");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await api("/api/content/popup", "POST", editing);
        toast("Popup created!");
      } else {
        await api(`/api/content/popup/${editing.id}`, "PUT", editing);
        toast("Popup updated!");
      }
      load();
      close();
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (n: PopupNotice) => {
    try {
      await api(`/api/content/popup/${n.id}`, "PUT", { active: !n.active });
      toast(n.active ? "Deactivated." : "Activated!");
      load();
    } catch {
      toast("Failed.", "error");
    }
  };

  const del = async (id: string) => {
    if (
      !confirm("Delete this popup? Image will also be removed from ImageKit.")
    )
      return;
    try {
      await api(`/api/content/popup/${id}`, "DELETE");
      toast("Deleted from MongoDB and ImageKit.");
      load();
    } catch {
      toast("Delete failed.", "error");
    }
  };

  if (!notices) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SH
          title="Notice Popups"
          sub="Manage popups shown to first-time visitors. Only first active popup is shown."
        />
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors"
        >
          + New Popup
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-hero w-full max-w-2xl my-4">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-serif font-bold text-navy-800 text-lg">
                {isNew ? "Create Popup Notice" : "Edit Popup Notice"}
              </h3>
              <button
                onClick={close}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field
                label="Title *"
                value={editing.title || ""}
                onChange={setE("title")}
                placeholder="e.g. Admission Open for 2082/83"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Badge Label"
                  value={editing.badge || ""}
                  onChange={setE("badge")}
                  placeholder="IMPORTANT NOTICE"
                />
                <Field
                  label="Subtitle"
                  value={editing.subtitle || ""}
                  onChange={setE("subtitle")}
                  placeholder="FEATURED SCHOOL UPDATE"
                />
              </div>
              <Field
                label="Body Text"
                type="textarea"
                value={editing.body || ""}
                onChange={setE("body")}
                rows={3}
                placeholder="Brief description..."
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notice Image{" "}
                  <span className="text-emerald-600 text-xs font-normal">
                    (upload your notice document photo)
                  </span>
                </label>
                {editing.image && (
                  <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100 mb-3">
                    <Image
                      src={editing.image}
                      alt="Preview"
                      fill
                      className="object-cover object-top"
                      sizes="600px"
                    />
                    <button
                      onClick={() =>
                        setEditing((e) =>
                          e ? { ...e, image: "", fileId: "" } : e,
                        )
                      }
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                      Paste URL
                    </p>
                    <AddByUrl
                      onAdd={(url) =>
                        setEditing((e) =>
                          e ? { ...e, image: url, fileId: "" } : e,
                        )
                      }
                      placeholder="https://...notice.jpg"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                      Upload
                    </p>
                    <UploadField
                      onUploaded={(files) =>
                        setEditing((e) =>
                          e
                            ? {
                                ...e,
                                image: files[0]?.url || "",
                                fileId: files[0]?.fileId || "",
                              }
                            : e,
                        )
                      }
                      label="Upload Notice Image"
                    />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Button Text"
                  value={editing.primaryBtnText || ""}
                  onChange={setE("primaryBtnText")}
                />
                <Field
                  label="Button Link"
                  value={editing.primaryBtnHref || ""}
                  onChange={setE("primaryBtnHref")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topic Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {((editing.tags as string[]) || []).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(i)}
                        className="text-gray-400 hover:text-red-500 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="e.g. Admission Updates"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Toggle
                    active={!!editing.active}
                    onChange={() => setE("active")(!editing.active)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {editing.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={close}
                    className="px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <Btn
                    saving={saving}
                    onClick={save}
                    label={isNew ? "Create Popup" : "Update Popup"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {notices.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-3">🔔</div>
            <p className="mb-4">No popups yet.</p>
            <button
              onClick={openNew}
              className="px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800"
            >
              Create your first popup
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Badge</div>
              <div className="col-span-2">Image</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Actions</div>
            </div>
            {notices.map((n) => (
              <div
                key={n.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 items-center"
              >
                <div className="md:col-span-4 font-medium text-navy-800 text-sm line-clamp-1">
                  {n.title}
                </div>
                <div className="md:col-span-2">
                  <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">
                    {n.badge}
                  </span>
                </div>
                <div className="md:col-span-2">
                  {n.image ? (
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={n.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <Toggle active={n.active} onChange={() => toggleActive(n)} />
                  <span className="text-xs text-gray-500">
                    {n.active ? "Active" : "Off"}
                  </span>
                </div>
                <div className="md:col-span-2 flex gap-1">
                  <button
                    onClick={() => openEdit(n)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg text-sm"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => del(n.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg text-sm"
                    title="Delete from MongoDB+ImageKit"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        <strong>💡 How it works:</strong> Only the first <strong>Active</strong>{" "}
        popup is shown to visitors. Deactivate to hide without deleting.
        Deleting also removes the image from ImageKit.
      </div>
    </div>
  );
}

// ── QUICKLINKS ────────────────────────────────────────────────────────────────
function QuicklinksSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [links, setLinks] = useState<Record<string, unknown>[] | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api("/api/content/quicklinks").then(setLinks);
  }, []);
  const update = (id: unknown, key: string, val: unknown) =>
    setLinks(
      (ls) => ls?.map((l) => (l.id === id ? { ...l, [key]: val } : l)) || null,
    );
  const add = () =>
    setLinks((ls) => [
      ...(ls || []),
      {
        id: Date.now().toString(),
        label: "New Portal",
        description: "",
        url: "",
        icon: "🔗",
        badge: "Portal",
        active: true,
      },
    ]);
  const remove = (id: unknown) =>
    setLinks((ls) => ls?.filter((l) => l.id !== id) || null);
  const save = async () => {
    setSaving(true);
    try {
      await api("/api/content/quicklinks", "PUT", links);
      toast("Quick links saved! Hard-refresh the website (Ctrl+Shift+R).");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  if (!links) return <Loader />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SH
          title="Quick Links"
          sub="ERP, LMS, Online Class portals on the homepage. Save then hard-refresh (Ctrl+Shift+R)."
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800"
        >
          + Add Link
        </button>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
        ⚠️ After saving, do a <strong>hard refresh</strong> on the website
        (press{" "}
        <kbd className="bg-white border border-amber-300 px-1.5 py-0.5 rounded text-xs">
          Ctrl+Shift+R
        </kbd>{" "}
        or{" "}
        <kbd className="bg-white border border-amber-300 px-1.5 py-0.5 rounded text-xs">
          Cmd+Shift+R
        </kbd>
        ) to see the updated links.
      </div>
      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={String(link.id)}
            className="bg-white rounded-2xl shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{String(link.icon)}</span>
                <span className="font-serif font-semibold text-navy-800">
                  {String(link.label)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {link.active ? "Visible" : "Hidden"}
                </span>
                <Toggle
                  active={!!link.active}
                  onChange={() => update(link.id, "active", !link.active)}
                />
                <button
                  onClick={() => remove(link.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Label"
                value={String(link.label)}
                onChange={(v) => update(link.id, "label", v)}
              />
              <Field
                label="Icon (emoji)"
                value={String(link.icon)}
                onChange={(v) => update(link.id, "icon", v)}
              />
              <Field
                label="URL"
                value={String(link.url)}
                onChange={(v) => update(link.id, "url", v)}
              />
              <Field
                label="Badge"
                value={String(link.badge)}
                onChange={(v) => update(link.id, "badge", v)}
              />
            </div>
            <div className="mt-4">
              <Field
                label="Description"
                type="textarea"
                value={String(link.description)}
                onChange={(v) => update(link.id, "description", v)}
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
      <Btn saving={saving} onClick={save} label="Save Quick Links" />
    </div>
  );
}

// ── NEWS ─────────────────────────────────────────────────────────────────────
const NEWS_CATS = [
  "Events",
  "Academics",
  "Notice",
  "Achievements",
  "Infrastructure",
  "Faculty",
];
const CAT_COLORS: Record<string, string> = {
  Events: "bg-blue-100 text-blue-700",
  Academics: "bg-green-100 text-green-700",
  Notice: "bg-orange-100 text-orange-700",
  Achievements: "bg-amber-100 text-amber-700",
  Infrastructure: "bg-violet-100 text-violet-700",
  Faculty: "bg-teal-100 text-teal-700",
};

function NewsSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [posts, setPosts] = useState<NewsPost[] | null>(null);
  const [editing, setEditing] = useState<Partial<NewsPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const load = useCallback(() => {
    api("/api/content/news").then(setPosts);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const openNew = () => {
    setIsNew(true);
    setEditing({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "Notice",
      date: "",
      author: "Admin",
      published: false,
    });
  };
  const openEdit = (p: NewsPost) => {
    setIsNew(false);
    setEditing({ ...p });
  };
  const close = () => {
    setEditing(null);
    setIsNew(false);
  };
  const setE = (key: string) => (val: string | boolean) =>
    setEditing((e) => (e ? { ...e, [key]: val } : e));
  const save = async () => {
    if (!editing?.title) {
      toast("Title required.", "error");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await api("/api/content/news", "POST", editing);
        toast("Post created!");
      } else {
        await api(`/api/content/news/${editing.id}`, "PUT", editing);
        toast("Post updated!");
      }
      load();
      close();
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const togglePublish = async (p: NewsPost) => {
    try {
      await api(`/api/content/news/${p.id}`, "PUT", {
        published: !p.published,
      });
      toast(p.published ? "Draft." : "Published!");
      load();
    } catch {
      toast("Failed.", "error");
    }
  };
  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api(`/api/content/news/${id}`, "DELETE");
      toast("Deleted.");
      load();
    } catch {
      toast("Delete failed.", "error");
    }
  };
  if (!posts) return <Loader />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SH
          title="News Posts"
          sub="Create, edit, publish and delete school news and notices."
        />
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800"
        >
          + New Post
        </button>
      </div>
      {editing && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-hero w-full max-w-2xl my-4">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-serif font-bold text-navy-800 text-lg">
                {isNew ? "Create Post" : "Edit Post"}
              </h3>
              <button
                onClick={close}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field
                label="Title *"
                value={editing.title || ""}
                onChange={setE("title")}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={editing.category || "Notice"}
                    onChange={(e) => setE("category")(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {NEWS_CATS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Date"
                  value={editing.date || ""}
                  onChange={setE("date")}
                  placeholder="e.g. Chaitra 15, 2081"
                />
              </div>
              <Field
                label="Author"
                value={editing.author || ""}
                onChange={setE("author")}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image
                </label>
                {editing.image && (
                  <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100 mb-3">
                    <Image
                      src={editing.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                    <button
                      onClick={() => setE("image")("")}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                      Paste URL
                    </p>
                    <AddByUrl
                      onAdd={(url) => setE("image")(url)}
                      placeholder="https://...jpg"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                      Upload
                    </p>
                    <UploadField
                      onUploaded={(files) => setE("image")(files[0]?.url || "")}
                      label="Upload Image"
                    />
                  </div>
                </div>
              </div>
              <Field
                label="Excerpt"
                type="textarea"
                value={editing.excerpt || ""}
                onChange={setE("excerpt")}
                rows={2}
              />
              <Field
                label="Full Content (HTML)"
                type="textarea"
                value={editing.content || ""}
                onChange={setE("content")}
                rows={10}
              />
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Toggle
                    active={!!editing.published}
                    onChange={() => setE("published")(!editing.published)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {editing.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={close}
                    className="px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <Btn
                    saving={saving}
                    onClick={save}
                    label={isNew ? "Create Post" : "Update Post"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Actions</div>
        </div>
        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📰</div>
            <p>No posts yet.</p>
          </div>
        )}
        {posts.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 items-center"
          >
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {p.image && (
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                )}
              </div>
              <span className="text-sm font-medium text-navy-800 line-clamp-1">
                {p.title}
              </span>
            </div>
            <div className="md:col-span-2">
              <span
                className={`badge text-[10px] ${CAT_COLORS[p.category] || "bg-gray-100 text-gray-600"}`}
              >
                {p.category}
              </span>
            </div>
            <div className="md:col-span-2 text-xs text-gray-400">{p.date}</div>
            <div className="md:col-span-1">
              <button
                onClick={() => togglePublish(p)}
                className={`text-xs font-semibold px-2 py-1 rounded-lg ${p.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {p.published ? "Live" : "Draft"}
              </button>
            </div>
            <div className="md:col-span-2 flex gap-1">
              <button
                onClick={() => openEdit(p)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg text-sm"
              >
                ✏️
              </button>
              <button
                onClick={() => del(p.id)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
const GAL_CATS = [
  "Campus",
  "Events",
  "Academic",
  "Facilities",
  "Achievements",
  "Sports",
  "Faculty",
];
function GallerySection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [newAlt, setNewAlt] = useState("");
  const [newCat, setNewCat] = useState("Campus");
  const [pending, setPending] = useState<UploadedFile[]>([]);
  const [saving, setSaving] = useState(false);
  const load = useCallback(() => {
    api("/api/content/gallery").then(setItems);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const addItems = async () => {
    if (pending.length === 0) {
      toast("Upload or paste at least one URL.", "error");
      return;
    }
    setSaving(true);
    try {
      for (const f of pending)
        await api("/api/content/gallery", "POST", {
          src: f.url,
          fileId: f.fileId,
          alt: newAlt || "School photo",
          category: newCat,
        });
      toast(`${pending.length} photo(s) added!`);
      setPending([]);
      setNewAlt("");
      load();
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Add failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const del = async (id: string) => {
    if (!confirm("Delete? This also removes the file from ImageKit.")) return;
    try {
      await api(`/api/content/gallery/${id}`, "DELETE");
      toast("Deleted from MongoDB and ImageKit.");
      load();
    } catch {
      toast("Delete failed.", "error");
    }
  };
  if (!items) return <Loader />;
  return (
    <div className="space-y-6">
      <SH
        title="Gallery"
        sub="Upload photos. Deleting removes from MongoDB AND ImageKit."
      />
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          Add New Photos
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Caption"
            value={newAlt}
            onChange={setNewAlt}
            placeholder="e.g. Students in Science Lab"
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {GAL_CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            📤 Upload from Device
          </p>
          <UploadField
            onUploaded={(files) => setPending((p) => [...p, ...files])}
            multiple={true}
            label="Import Image File(s)"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            🔗 Paste URL
          </p>
          <AddByUrl
            onAdd={(url) => setPending((p) => [...p, { url, fileId: "" }])}
            placeholder="https://...photo.jpg"
          />
        </div>
        {pending.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">
              {pending.length} photo(s) ready:
            </p>
            <div className="flex flex-wrap gap-2">
              {pending.map((f, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <Image
                    src={f.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <button
                    onClick={() =>
                      setPending((p) => p.filter((_, j) => j !== i))
                    }
                    className="absolute inset-0 bg-red-500/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Btn
          saving={saving}
          onClick={addItems}
          label={`Add ${pending.length || ""} Photo(s)`}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-serif font-semibold text-navy-800 mb-4">
          Gallery ({items.length} photos)
        </h3>
        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">📷</div>
            <p>No photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <div className="relative h-24 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-xl">
                    <button
                      onClick={() => del(item.id)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow text-sm"
                      title="Delete from MongoDB + ImageKit"
                    >
                      🗑
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-gray-500 truncate">
                  {item.alt}
                </p>
                <span className="text-[10px] text-blue-500 font-medium">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ABOUT SECTION ─────────────────────────────────────────────────────────────
function AboutSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api("/api/content/settings").then(setData);
  }, []);
  const set = (key: string) => (val: string) =>
    setData((d) => (d ? { ...d, [key]: val } : d));
  const save = async () => {
    setSaving(true);
    try {
      const result = await api("/api/content/settings", "PUT", data);
      if (result.data) setData(result.data);
      toast("About section saved! Refresh the website.");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  if (!data) return <Loader />;
  return (
    <div className="space-y-6">
      <SH
        title="About Page Content"
        sub="Edit the content shown on the About page — principal, mission, vision, intro."
      />
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          School Introduction
        </h3>
        <Field
          label="About Introduction Paragraph"
          type="textarea"
          value={String(data.aboutIntro || "")}
          onChange={set("aboutIntro")}
          rows={4}
          placeholder="Brief history and introduction of the school..."
        />
        <Field
          label="Mission Statement"
          type="textarea"
          value={String(data.aboutMission || "")}
          onChange={set("aboutMission")}
          rows={3}
          placeholder="Our mission is..."
        />
        <Field
          label="Vision Statement"
          type="textarea"
          value={String(data.aboutVision || "")}
          onChange={set("aboutVision")}
          rows={3}
          placeholder="Our vision is..."
        />
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          Principal Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Principal Name"
            value={String(data.principalName || "")}
            onChange={set("principalName")}
          />
          <Field
            label="Title"
            value={String(data.principalTitle || "")}
            onChange={set("principalTitle")}
          />
        </div>
        <Field
          label="Principal Image URL"
          value={String(data.principalImage || "")}
          onChange={set("principalImage")}
        />
        {!!data.principalImage && (
          <div className="flex gap-4 items-center">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={String(data.principalImage)}
                alt="Principal"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">
                Or upload a new photo
              </p>
              <UploadField
                onUploaded={(files) => {
                  set("principalImage")(files[0]?.url || "");
                  set("principalImageFileId")(files[0]?.fileId || "");
                }}
                label="Upload Principal Photo"
              />
            </div>
          </div>
        )}
        <Field
          label="Principal Quote"
          type="textarea"
          value={String(data.principalQuote || "")}
          onChange={set("principalQuote")}
          rows={2}
        />
        <Field
          label="Principal Message"
          type="textarea"
          value={String(data.principalMessage || "")}
          onChange={set("principalMessage")}
          rows={5}
        />
      </div>
      <Btn saving={saving} onClick={save} label="Save About Content" />
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api("/api/content/settings").then(setData);
  }, []);
  const set = (key: string) => (val: string) =>
    setData((d) => (d ? { ...d, [key]: val } : d));
  const setSocial = (key: string) => (val: string) =>
    setData((d) =>
      d
        ? {
            ...d,
            social: { ...(d.social as Record<string, string>), [key]: val },
          }
        : d,
    );
  const save = async () => {
    setSaving(true);
    try {
      const r = await api("/api/content/settings", "PUT", data);
      if (r.data) setData(r.data);
      toast("Settings saved! Refresh website.");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  if (!data) return <Loader />;
  const social = (data.social || {}) as Record<string, string>;
  return (
    <div className="space-y-6">
      <SH
        title="Site Settings"
        sub="School info, logo, favicon, social links, SEO."
      />

      {/* Logo & Favicon */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          🏷️ Logo & Favicon
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site Logo
            </label>
            {data.logo ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={String(data.logo)}
                    alt="Logo"
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
                <button
                  onClick={() =>
                    setData((d) => (d ? { ...d, logo: "", logoFileId: "" } : d))
                  }
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-400 mb-3 p-3 border border-dashed border-gray-300 rounded-xl">
                No logo uploaded
              </div>
            )}
            <Field
              label="Logo URL"
              value={String(data.logo || "")}
              onChange={set("logo")}
              placeholder="https://...logo.png"
            />
            <div className="mt-2">
              <UploadField
                onUploaded={(files) => {
                  set("logo")(files[0]?.url || "");
                  set("logoFileId")(files[0]?.fileId || "");
                }}
                label="Upload Logo"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Favicon{" "}
              <span className="text-gray-400 text-xs font-normal">
                (32×32 or 16×16 .ico/.png)
              </span>
            </label>
            {data.favicon ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={String(data.favicon)}
                    alt="Favicon"
                    fill
                    className="object-contain p-0.5"
                    sizes="40px"
                  />
                </div>
                <button
                  onClick={() =>
                    setData((d) =>
                      d ? { ...d, favicon: "", faviconFileId: "" } : d,
                    )
                  }
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-400 mb-3 p-3 border border-dashed border-gray-300 rounded-xl">
                No favicon uploaded
              </div>
            )}
            <Field
              label="Favicon URL"
              value={String(data.favicon || "")}
              onChange={set("favicon")}
              placeholder="https://...favicon.ico"
            />
            <div className="mt-2">
              <UploadField
                onUploaded={(files) => {
                  set("favicon")(files[0]?.url || "");
                  set("faviconFileId")(files[0]?.fileId || "");
                }}
                label="Upload Favicon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* School info */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          School Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="School Name"
            value={String(data.name || "")}
            onChange={set("name")}
          />
          <Field
            label="Est. Year"
            value={String(data.estYear || "")}
            onChange={set("estYear")}
          />
          <Field
            label="Phone"
            value={String(data.phone || "")}
            onChange={set("phone")}
          />
          <Field
            label="Email"
            value={String(data.email || "")}
            onChange={set("email")}
          />
        </div>
        <Field
          label="Address"
          value={String(data.address || "")}
          onChange={set("address")}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          Social Media
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Facebook"
            value={social.facebook || ""}
            onChange={setSocial("facebook")}
          />
          <Field
            label="Twitter / X"
            value={social.twitter || ""}
            onChange={setSocial("twitter")}
          />
          <Field
            label="YouTube"
            value={social.youtube || ""}
            onChange={setSocial("youtube")}
          />
          <Field
            label="Instagram"
            value={social.instagram || ""}
            onChange={setSocial("instagram")}
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          SEO & Meta
        </h3>
        <Field
          label="Meta Title"
          value={String(data.metaTitle || "")}
          onChange={set("metaTitle")}
        />
        <Field
          label="Meta Description"
          type="textarea"
          value={String(data.metaDescription || "")}
          onChange={set("metaDescription")}
          rows={2}
        />
      </div>
      <Btn saving={saving} onClick={save} label="Save All Settings" />
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function OverviewSection({ setSection }: { setSection: (s: Section) => void }) {
  const [counts, setCounts] = useState({
    news: 0,
    gallery: 0,
    published: 0,
    popups: 0,
    slides: 0,
  });
  useEffect(() => {
    Promise.all([
      api("/api/content/news"),
      api("/api/content/gallery"),
      api("/api/content/popup"),
      api("/api/content/hero-slides"),
    ]).then(([n, g, p, s]) => {
      setCounts({
        news: n.length,
        gallery: g.length,
        published: n.filter((x: NewsPost) => x.published).length,
        popups: p.filter((x: PopupNotice) => x.active).length,
        slides: s.length,
      });
    });
  }, []);
  return (
    <div className="space-y-6">
      <SH
        title="Dashboard"
        sub="Manage all content on the Anupam Vidya Sadan website."
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            icon: "📰",
            label: "Total Posts",
            value: String(counts.news),
            sub: `${counts.published} live`,
            color: "bg-blue-100",
            section: "news" as Section,
          },
          {
            icon: "🔔",
            label: "Active Popups",
            value: String(counts.popups),
            sub: "Shown to visitors",
            color: "bg-emerald-100",
            section: "popup" as Section,
          },
          {
            icon: "📷",
            label: "Gallery Photos",
            value: String(counts.gallery),
            sub: "Total images",
            color: "bg-violet-100",
            section: "gallery" as Section,
          },
          {
            icon: "🖼️",
            label: "Hero Slides",
            value: String(counts.slides),
            sub: "In slider",
            color: "bg-orange-100",
            section: "hero" as Section,
          },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setSection(s.section)}
            className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow text-left"
          >
            <div
              className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-xl flex-shrink-0`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-navy-800 font-serif">
                {s.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-serif font-bold text-navy-800 mb-5">
          Manage Content
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              "hero",
              "popup",
              "quicklinks",
              "news",
              "gallery",
              "about",
              "contact",
              "messages",
              "settings",
              "credentials",
            ] as Section[]
          ).map((s) => {
            const info: Record<string, [string, string]> = {
              hero: ["🖼️", "Hero Slider"],
              quicklinks: ["🔗", "Quick Links"],
              popup: ["🔔", "Notice Popups"],
              news: ["📰", "News Posts"],
              gallery: ["📷", "Gallery"],
              about: ["📄", "About Page"],
              contact: ["✉️", "Contact Page"],
              messages: ["📬", "Messages"],
              settings: ["⚙️", "Site Settings"],
              credentials: ["🔐", "Admin Login"],
            };
            return (
              <button
                key={s}
                onClick={() => setSection(s)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="text-2xl mb-2">{info[s][0]}</div>
                <div className="text-sm font-semibold text-navy-800 group-hover:text-blue-700 leading-none">
                  {info[s][1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── CONTACT PAGE SETTINGS ────────────────────────────────────────────────────
function ContactSettingsSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api("/api/content/settings").then(setData);
  }, []);
  const set = (key: string) => (val: string | boolean) =>
    setData((d) => (d ? { ...d, [key]: val } : d));
  const save = async () => {
    setSaving(true);
    try {
      const r = await api("/api/content/settings", "PUT", data);
      if (r.data) setData(r.data);
      toast("Contact settings saved! Refresh website.");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  if (!data) return <Loader />;
  return (
    <div className="space-y-6">
      <SH
        title="Contact Page Settings"
        sub="Edit the information shown on the Contact page and control the contact form."
      />
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h3 className="font-serif font-semibold text-navy-800 pb-3 border-b border-gray-100">
          Contact Information
        </h3>
        <Field
          label="Contact Email (displayed on page + receives form submissions)"
          value={String(data.contactEmail || "")}
          onChange={(val) => set("contactEmail")(val)}
          placeholder="info@anupamvidyasadan.edu.np"
        />
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Office Hours — Weekdays"
            value={String(data.officeHoursWeekday || "")}
            onChange={(val) => set("officeHoursWeekday")(val)}
            placeholder="9:00 AM – 4:00 PM"
          />
          <Field
            label="Office Hours — Saturday"
            value={String(data.officeHoursSaturday || "")}
            onChange={(val) => set("officeHoursSaturday")(val)}
            placeholder="9:00 AM – 12:00 PM"
          />
        </div>
        <Field
          label="Google Maps Embed URL (optional)"
          type="textarea"
          value={String(data.mapEmbedUrl || "")}
          onChange={(val) => set("mapEmbedUrl")(val)}
          rows={3}
          placeholder="Paste the src URL from Google Maps → Share → Embed a map"
        />
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-navy-800 text-sm">
              Contact Form Active
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              When off, visitors see a message instead of the form
            </p>
          </div>
          <Toggle
            active={!!data.contactFormActive}
            onChange={() => set("contactFormActive")(!data.contactFormActive)}
          />
        </div>
      </div>
      <Btn saving={saving} onClick={save} label="Save Contact Settings" />
    </div>
  );
}

// ── CONTACT MESSAGES ──────────────────────────────────────────────────────────
interface ContactMsg {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}
const STATUS_STYLES: Record<string, string> = {
  unread: "bg-red-100 text-red-700",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
};

function ContactMessagesSection({
  toast,
}: {
  toast: (m: string, t?: "success" | "error") => void;
}) {
  const [data, setData] = useState<{
    messages: ContactMsg[];
    total: number;
  } | null>(null);
  const [selected, setSelected] = useState<ContactMsg | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(() => {
    const qs = filter !== "all" ? `?status=${filter}` : "";
    api(`/api/contact/messages${qs}`).then(setData);
  }, [filter]);
  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: ContactMsg["status"]) => {
    try {
      await api(`/api/contact/messages/${id}`, "PATCH", { status });
      toast("Status updated.");
      load();
      if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : s));
    } catch {
      toast("Update failed.", "error");
    }
  };
  const del = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      await api(`/api/contact/messages/${id}`, "DELETE");
      toast("Deleted.");
      setSelected(null);
      load();
    } catch {
      toast("Delete failed.", "error");
    }
  };

  if (!data) return <Loader />;

  return (
    <div className="space-y-6">
      <SH
        title="Contact Messages"
        sub="View and manage enquiries submitted via the contact form."
      />
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "read", "replied"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${filter === f ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
          >
            {f === "all" ? `All (${data.total})` : f}
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-hero w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-serif font-bold text-navy-800">
                Message Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 font-medium">From</span>
                  <p className="text-navy-800 font-semibold mt-0.5">
                    {selected.fullName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Email</span>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-blue-600 underline block mt-0.5 text-sm"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div>
                    <span className="text-gray-400 font-medium">Phone</span>
                    <p className="text-navy-800 mt-0.5">{selected.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 font-medium">Date</span>
                  <p className="text-navy-800 mt-0.5">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-medium">
                  Subject
                </span>
                <p className="text-navy-800 font-semibold mt-1">
                  {selected.subject}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-medium">
                  Message
                </span>
                <div className="mt-1 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {(["unread", "read", "replied"] as ContactMsg["status"][]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize border ${selected.status === s ? "bg-navy-800 text-white border-navy-800" : "border-gray-300 text-gray-600 hover:border-navy-800"}`}
                    >
                      Mark {s}
                    </button>
                  ),
                )}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors ml-auto"
                >
                  Reply via Email ↗
                </a>
                <button
                  onClick={() => del(selected.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {data.messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>
              No messages {filter !== "all" ? `with status "${filter}"` : "yet"}
              .
            </p>
          </div>
        ) : (
          data.messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelected(msg);
                updateStatus(
                  msg.id,
                  msg.status === "unread" ? "read" : msg.status,
                );
              }}
              className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer flex items-start gap-4 ${msg.status === "unread" ? "bg-blue-50/30" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {msg.status === "unread" && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  )}
                  <span className="font-semibold text-navy-800 text-sm truncate">
                    {msg.fullName}
                  </span>
                  <span className="text-gray-400 text-xs flex-shrink-0">
                    {msg.email}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium truncate">
                  {msg.subject}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {msg.message}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                <span
                  className={`badge text-[10px] ${STATUS_STYLES[msg.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {msg.status}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── ADMIN CREDENTIALS ─────────────────────────────────────────────────────────
function CredentialsSection({
  toast,
  logout,
}: {
  toast: (m: string, t?: "success" | "error") => void;
  logout: () => void;
}) {
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/admin/credentials").then((d: { email: string }) => {
      setCurrentEmail(d.email);
      setEmail(d.email);
    });
  }, []);

  const save = async () => {
    if (!email.trim()) {
      toast("Email is required.", "error");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast("Password must be at least 8 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match.", "error");
      return;
    }
    setSaving(true);
    try {
      await api("/api/admin/credentials", "PUT", {
        email,
        newPassword,
        confirmPassword,
      });
      toast("Credentials updated! You will be logged out now.");
      setTimeout(logout, 2000);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SH
        title="Admin Credentials"
        sub="Change your admin login email and password. You will be logged out after saving."
      />
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          ⚠️ <strong>Important:</strong> After saving, your current session will
          end and you will need to log in with the new credentials. Make sure to
          remember them.
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1.5">
            Current Admin Email
          </label>
          <p className="text-navy-800 font-medium">
            {currentEmail || "Loading…"}
          </p>
        </div>
        <Field
          label="New Email Address"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="admin@yourschool.edu.np"
        />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
          {newPassword && newPassword.length < 8 && (
            <p className="mt-1 text-xs text-red-500">
              Password must be at least 8 characters
            </p>
          )}
        </div>
        <Field
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          placeholder="Re-enter new password"
        />
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
        <Btn
          saving={saving}
          onClick={save}
          label="Update Credentials & Log Out"
        />
      </div>
    </div>
  );
}

const SIDEBAR: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Dashboard", icon: "📊" },
  { id: "hero", label: "Hero Slider", icon: "🖼️" },
  { id: "quicklinks", label: "Quick Links", icon: "🔗" },
  { id: "popup", label: "Notice Popups", icon: "🔔" },
  { id: "news", label: "News Posts", icon: "📰" },
  { id: "gallery", label: "Gallery", icon: "📷" },
  { id: "about", label: "About Page", icon: "📄" },
  { id: "contact", label: "Contact Page", icon: "✉️" },
  { id: "messages", label: "Contact Messages", icon: "📬" },
  { id: "settings", label: "Site Settings", icon: "⚙️" },
  { id: "credentials", label: "Admin Credentials", icon: "🔐" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToasts((t) => [...t, { id, msg, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
    },
    [],
  );

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const renderSection = () => {
    switch (section) {
      case "overview":
        return <OverviewSection setSection={setSection} />;
      case "hero":
        return <HeroSection toast={toast} />;
      case "quicklinks":
        return <QuicklinksSection toast={toast} />;
      case "popup":
        return <PopupSection toast={toast} />;
      case "news":
        return <NewsSection toast={toast} />;
      case "gallery":
        return <GallerySection toast={toast} />;
      case "about":
        return <AboutSection toast={toast} />;
      case "contact":
        return <ContactSettingsSection toast={toast} />;
      case "messages":
        return <ContactMessagesSection toast={toast} />;
      case "settings":
        return <SettingsSection toast={toast} />;
      case "credentials":
        return <CredentialsSection toast={toast} logout={logout} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-navy-900 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="font-bold text-white font-serif">A</span>
          </div>
          <div>
            <p className="text-white font-serif font-bold text-sm leading-none">
              Anupam Vidya Sadan
            </p>
            <p className="text-blue-300/60 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {SIDEBAR.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === item.id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
              >
                <span className="w-6 text-center">{item.icon}</span>
                {item.label}
                {section === item.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        </nav>
        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Website
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-red-500/20 transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Admin</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-navy-800">
                  {SIDEBAR.find((s) => s.id === section)?.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:border-blue-400 hover:text-blue-700 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Site
              </a>
              <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
      <ToastBar
        toasts={toasts}
        remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))}
      />
    </div>
  );
}
