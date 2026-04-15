import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth.edge"; // ✅ changed
// middleware.ts

// ... rest of the file stays exactly the same

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── /admin  →  same as /admin/dashboard ─────────────────────────────────
  // Redirect bare /admin to /admin/dashboard (or /admin/login if not authed)
  if (pathname === "/admin" || pathname === "/admin/") {
    const session = await getSessionFromRequest(request);
    const dest = session ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── /admin/login  →  already logged in? go to dashboard ─────────────────
  if (pathname === "/admin/login") {
    const session = await getSessionFromRequest(request);
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── /admin/dashboard and all other /admin/* routes ───────────────────────
  // Require authentication; unauthenticated → /admin/login
  if (pathname.startsWith("/admin/")) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin, /admin/, and all /admin/* sub-paths
  matcher: ["/admin", "/admin/", "/admin/:path*"],
};
