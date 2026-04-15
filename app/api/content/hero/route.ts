import { NextRequest, NextResponse } from "next/server";
import { getHeroConfig, saveHeroConfig } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await getHeroConfig()); }
  catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    const data = await saveHeroConfig(body);
    return NextResponse.json({ success: true, data });
  } catch (e: unknown) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
