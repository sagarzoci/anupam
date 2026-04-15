import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryItem } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const deleted = await deleteGalleryItem(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted from MongoDB and ImageKit." });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
