import { NextRequest, NextResponse } from "next/server";
import { getPopupNotices, createPopupNotice } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getPopupNotices());
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    const notice = await createPopupNotice(body);
    return NextResponse.json(notice, { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
