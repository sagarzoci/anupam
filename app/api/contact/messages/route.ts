import { NextRequest, NextResponse } from "next/server";
import { getContactMessages } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
import type { ContactStatus } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? "20")));
    const statusParam = url.searchParams.get("status");
    const status = (statusParam as ContactStatus) || undefined;

    const result = await getContactMessages(page, limit, status);
    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
