import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getSettings()); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try { return NextResponse.json({ success: true, data: await saveSettings(await req.json()) }); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
