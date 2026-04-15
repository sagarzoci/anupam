import { NextRequest, NextResponse } from "next/server";
import { getNews, createNewsPost } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

function makeSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80) + "-" + Date.now().toString(36);
}

export async function GET() {
  try { return NextResponse.json(await getNews()); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    const post = await createNewsPost({ ...body, slug: makeSlug(body.title) });
    return NextResponse.json(post, { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
