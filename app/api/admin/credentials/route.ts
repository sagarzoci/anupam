import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import { changeAdminCredentials, getAdminEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET — returns the current admin email (never returns passwords) */
export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const email = await getAdminEmail();
  return NextResponse.json({ email });
}

/** PUT — update admin email and/or password */
export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { email, newPassword, confirmPassword } = await req.json() as {
      email: string;
      newPassword: string;
      confirmPassword: string;
    };

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    // Validate passwords match
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    await changeAdminCredentials(email.trim(), newPassword);
    return NextResponse.json({ success: true, message: "Credentials updated. Please log in again." });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
