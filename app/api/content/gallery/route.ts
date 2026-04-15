import { NextRequest, NextResponse } from "next/server";
import { getGallery, addGalleryItem } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getGallery()); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const { src, fileId = "", alt, category } = await req.json();
    if (!src) return NextResponse.json({ error: "Image URL required." }, { status: 400 });
    const item = await addGalleryItem({ src, fileId, alt: alt || "School photo", category: category || "Campus" });
    return NextResponse.json(item, { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
