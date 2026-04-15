"use client";

import { useState, useRef, useCallback } from "react";

interface UploadEntry {
  id: string;
  name: string;
  bytesLoaded: number;
  totalBytes: number;
  progress: number;
  status: "uploading" | "completed" | "error";
  url: string;
  fileId: string;
  error: string;
}

export interface ImageUploaderProps {
  /**
   * Called once per successfully uploaded file.
   * urls[i] and fileIds[i] refer to the same file.
   */
  onUploaded: (urls: string[], fileIds: string[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageUploader({
  onUploaded,
  accept = "image/*",
  multiple = true,
  label = "Import Image File",
}: ImageUploaderProps) {
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (rawFiles: File[]) => {
      const initial: UploadEntry[] = rawFiles.map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        bytesLoaded: 0,
        totalBytes: f.size,
        progress: 0,
        status: "uploading",
        url: "",
        fileId: "",
        error: "",
      }));

      setEntries(prev => [...prev, ...initial]);

      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];
        const entryId = initial[i].id;

        const tick = setInterval(() => {
          setEntries(prev =>
            prev.map(e =>
              e.id === entryId && e.progress < 82
                ? {
                    ...e,
                    progress: e.progress + Math.random() * 18,
                    bytesLoaded: Math.floor(e.totalBytes * (e.progress / 100)),
                  }
                : e,
            ),
          );
        }, 200);

        try {
          const fd = new FormData();
          fd.append("files", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json() as {
            success?: boolean;
            error?: string;
            files?: Array<{ url: string; fileId: string; size: number }>;
          };

          clearInterval(tick);

          if (!res.ok) throw new Error(data.error ?? "Upload failed");

          const uploaded = data.files?.[0];
          const url = uploaded?.url ?? "";
          const fileId = uploaded?.fileId ?? "";

          setEntries(prev =>
            prev.map(e =>
              e.id === entryId
                ? { ...e, progress: 100, bytesLoaded: e.totalBytes, status: "completed", url, fileId }
                : e,
            ),
          );

          // Notify parent: one url + one fileId per upload call
          onUploaded([url], [fileId]);
        } catch (err) {
          clearInterval(tick);
          const message = err instanceof Error ? err.message : "Upload failed";
          setEntries(prev =>
            prev.map(e =>
              e.id === entryId ? { ...e, status: "error", error: message } : e,
            ),
          );
        }
      }
    },
    [onUploaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter(f =>
        f.type.startsWith("image/"),
      );
      if (files.length > 0) uploadFiles(files);
    },
    [uploadFiles],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) uploadFiles(files);
    e.target.value = "";
  };

  const removeEntry = (id: string) =>
    setEntries(prev => prev.filter(e => e.id !== id));

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === "Enter") inputRef.current?.click(); }}
        className={[
          "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200",
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-12 bg-gray-200 rounded-lg flex items-end justify-center pb-1.5 mx-auto">
            <span className="text-[9px] font-bold text-gray-500 bg-gray-400/30 px-1 rounded">IMG</span>
          </div>
          <p className="font-semibold text-gray-700 text-sm">{label}</p>
          <p className="text-gray-400 text-xs">Drop or click to choose · JPG, PNG, WebP ≤ 10 MB</p>
        </div>
      </div>

      {/* File list */}
      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-end justify-center pb-1 flex-shrink-0">
                  <span className="text-[7px] font-bold text-red-500 bg-red-50 px-0.5 rounded">IMG</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800 truncate max-w-[200px]">
                      {entry.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      aria-label="Remove file"
                      className="ml-2 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {entry.status === "completed" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                    <span>{fmtBytes(entry.bytesLoaded)} of {fmtBytes(entry.totalBytes)}</span>
                    <span>·</span>
                    {entry.status === "uploading" && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading…
                      </span>
                    )}
                    {entry.status === "completed" && (
                      <span className="text-green-600 font-medium">✅ Completed</span>
                    )}
                    {entry.status === "error" && (
                      <span className="text-red-500 font-medium">{entry.error}</span>
                    )}
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-300",
                        entry.status === "error"
                          ? "bg-red-400"
                          : entry.status === "completed"
                          ? "bg-green-500"
                          : "bg-blue-500",
                      ].join(" ")}
                      style={{ width: `${Math.round(entry.progress)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
