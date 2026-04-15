// lib/auth.edge.ts
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export interface AdminPayload {
  email: string;
  role: "admin";
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production",
);

const COOKIE_NAME = "avs_admin_session";

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(
  req: NextRequest,
): Promise<AdminPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
