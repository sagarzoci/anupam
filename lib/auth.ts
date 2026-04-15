import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import type { IAdminConfig } from "./models/AdminConfig";

const scryptAsync = promisify(scrypt);

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production",
);

const COOKIE_NAME = "avs_admin_session";
const EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days

export interface AdminPayload {
  email: string;
  role: "admin";
}

// ─── JWT helpers ──────────────────────────────────────────────────────────────
export async function createToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionFromRequest(
  req: NextRequest,
): Promise<AdminPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: EXPIRES_IN,
    path: "/",
  };
}

export function clearSessionCookie() {
  return { name: COOKIE_NAME, value: "", httpOnly: true, maxAge: 0, path: "/" };
}

// ─── Password hashing (scrypt, built-in Node.js — no extra packages) ──────────
export async function hashPassword(
  password: string,
): Promise<{ salt: string; passwordHash: string }> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);
  return { salt, passwordHash: (derivedKey as Buffer).toString("hex") };
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
  salt: string,
): Promise<boolean> {
  try {
    const derived = await scryptAsync(password, salt, 64);
    return timingSafeEqual(derived as Buffer, Buffer.from(passwordHash, "hex"));
  } catch {
    return false;
  }
}

// ─── Credential validation: MongoDB first, then env fallback ─────────────────
export async function validateCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  try {
    const { default: connectDB } = await import("./db");
    const { default: AdminConfigModel } = await import("./models/AdminConfig");
    await connectDB();
    const config = await AdminConfigModel.findOne().lean<IAdminConfig | null>();
    if (config) {
      if (email.toLowerCase() !== config.email.toLowerCase()) return false;
      return verifyPassword(password, config.passwordHash, config.salt);
    }
  } catch {
    // DB unavailable — fall through
  }
  // Env var fallback
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}

export async function changeAdminCredentials(
  newEmail: string,
  newPassword: string,
): Promise<void> {
  const { default: connectDB } = await import("./db");
  const { default: AdminConfigModel } = await import("./models/AdminConfig");
  await connectDB();
  const { salt, passwordHash } = await hashPassword(newPassword);
  await AdminConfigModel.findOneAndUpdate(
    {},
    { email: newEmail.toLowerCase().trim(), passwordHash, salt },
    { new: true, upsert: true, runValidators: false },
  );
}

export async function getAdminEmail(): Promise<string> {
  try {
    const { default: connectDB } = await import("./db");
    const { default: AdminConfigModel } = await import("./models/AdminConfig");
    await connectDB();
    const config = await AdminConfigModel.findOne().select("email").lean<Pick<IAdminConfig, "email"> | null>();
    if (config?.email) return config.email;
  } catch { /* ignore */ }
  return process.env.ADMIN_EMAIL ?? "";
}
