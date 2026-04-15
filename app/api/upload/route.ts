import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import ImageKit from "imagekit";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// Initialise ImageKit SDK (server-side only)
function getImageKit(): ImageKit {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit credentials missing. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env.local"
    );
  }

  return new ImageKit({ publicKey, privateKey, urlEndpoint });
}

export async function POST(req: NextRequest) {
  // Require admin auth
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const imagekit = getImageKit();
    const results: { name: string; url: string; fileId: string; size: number }[] = [];

    for (const file of files) {
      // Validate MIME type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type "${file.type}" is not allowed. Use JPG, PNG, WebP, or GIF.` },
          { status: 400 }
        );
      }

      // Validate size
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds the 10 MB limit.` },
          { status: 400 }
        );
      }

      // Convert file to base64 for ImageKit SDK
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      // Build a clean filename
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      // Upload to ImageKit
      const response = await imagekit.upload({
        file: base64,
        fileName: safeName,
        folder: "/anupam-vidya-sadan",
        useUniqueFileName: true,
        tags: ["school-website"],
      });

      results.push({
        name: file.name,
        url: response.url,           // Full ImageKit CDN URL — stored in MongoDB
        fileId: response.fileId,     // ImageKit file ID (for deletion later)
        size: file.size,
      });
    }

    return NextResponse.json({ success: true, files: results });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
