import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    // validateCredentials is now async — checks MongoDB then env vars
    const valid = await validateCredentials(email, password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createToken({ email, role: "admin" });
    const res = NextResponse.json({ success: true, message: "Login successful." });
    res.cookies.set(setSessionCookie(token));
    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
