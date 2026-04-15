import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { requireAuth } from "@/lib/apiAuth";

/**
 * GET /api/imagekit-auth
 *
 * Returns ImageKit authentication parameters for client-side direct uploads.
 * Requires admin session.
 *
 * Response: { token, expire, signature }
 */
export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });

    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Auth failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
