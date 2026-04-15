import { NextRequest, NextResponse } from "next/server";
import { getHeroSlides, createHeroSlide } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getHeroSlides()); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    if (!body.image) return NextResponse.json({ error: "Image URL required." }, { status: 400 });
    const slide = await createHeroSlide({ image: body.image, fileId: body.fileId || "", alt: body.alt || "School photo", active: body.active ?? true, order: body.order ?? 0 });
    return NextResponse.json(slide, { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
