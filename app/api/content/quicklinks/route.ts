import { NextRequest, NextResponse } from "next/server";
import { getQuickLinks, saveQuickLinks } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getQuickLinks()); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try { await saveQuickLinks(await req.json()); return NextResponse.json({ success: true }); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
