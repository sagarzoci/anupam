import { NextRequest, NextResponse } from "next/server";
import { updateContactStatus, deleteContactMessage } from "@/lib/storage";
import { requireAuth } from "@/lib/apiAuth";
import type { ContactStatus } from "@/lib/storage";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { status } = await req.json() as { status: ContactStatus };
    const valid: ContactStatus[] = ["unread", "read", "replied"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }
    const updated = await updateContactStatus(id, status);
    if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const deleted = await deleteContactMessage(id);
    if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
