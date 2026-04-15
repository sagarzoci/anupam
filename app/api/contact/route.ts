import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createContactMessage } from "@/lib/storage";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace to prevent XSS in stored/emailed content */
function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

/** Basic email format check */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Get real client IP, accounting for proxies */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // ── 1. Rate limiting: 3 submissions per IP per hour ──────────────────────
  const rl = checkRateLimit({ key: `contact:${ip}`, limit: 3, windowSec: 3600 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  // ── 2. Parse body ─────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── 3. Honeypot check ─────────────────────────────────────────────────────
  // The frontend renders a hidden field named "website". Bots fill it in;
  // real users never see it. If it has any value, reject silently.
  if (body.website) {
    // Return 200 to not tip off bots
    return NextResponse.json({ success: true });
  }

  // ── 4. Extract and sanitize fields ───────────────────────────────────────
  const fullName = sanitize(String(body.fullName ?? ""));
  const email = sanitize(String(body.email ?? "")).toLowerCase();
  const phone = sanitize(String(body.phone ?? ""));
  const subject = sanitize(String(body.subject ?? ""));
  const message = sanitize(String(body.message ?? ""));

  // ── 5. Server-side validation ────────────────────────────────────────────
  const errors: Record<string, string> = {};

  if (!fullName || fullName.length < 2) errors.fullName = "Full name must be at least 2 characters.";
  if (fullName.length > 120) errors.fullName = "Full name is too long.";

  if (!email) errors.email = "Email address is required.";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";

  if (phone && phone.length > 30) errors.phone = "Phone number is too long.";

  if (!subject || subject.length < 3) errors.subject = "Subject must be at least 3 characters.";
  if (subject.length > 200) errors.subject = "Subject is too long.";

  if (!message || message.length < 10) errors.message = "Message must be at least 10 characters.";
  if (message.length > 5000) errors.message = "Message is too long (max 5000 characters).";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });
  }

  // ── 6. Save to MongoDB ───────────────────────────────────────────────────
  try {
    await createContactMessage({
      fullName,
      email,
      phone,
      subject,
      message,
      status: "unread",
      ip,
    });
  } catch (dbErr) {
    console.error("[Contact] MongoDB save failed:", dbErr);
    // Non-fatal — still try to send email
  }

  // ── 7. Send emails via Resend ────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || "";

  if (!resendKey) {
    console.warn("[Contact] RESEND_API_KEY not set — skipping email delivery.");
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(resendKey);

  try {
    // 7a. Notify the school admin
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: buildAdminEmailHtml({ fullName, email, phone, subject, message }),
    });

    // 7b. Auto-reply to the sender
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "We received your message — Anupam Vidya Sadan",
      html: buildConfirmationEmailHtml({ fullName, subject }),
    });
  } catch (emailErr) {
    console.error("[Contact] Resend delivery failed:", emailErr);
    // Message is saved in MongoDB — don't fail the request
    return NextResponse.json({
      success: true,
      warning: "Message saved but email delivery failed. We will still respond.",
    });
  }

  return NextResponse.json({ success: true });
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildAdminEmailHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f7fb;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);padding:28px 36px;">
            <h1 style="color:#fff;font-size:20px;margin:0;">📬 New Contact Form Submission</h1>
            <p style="color:#93c5fd;font-size:13px;margin:6px 0 0;">Anupam Vidya Sadan — School Website</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("👤 Full Name", data.fullName)}
              ${row("✉️ Email", `<a href="mailto:${data.email}" style="color:#1d4ed8;">${data.email}</a>`)}
              ${data.phone ? row("📞 Phone", data.phone) : ""}
              ${row("📋 Subject", data.subject)}
            </table>
            <p style="font-size:13px;font-weight:600;color:#374151;margin:20px 0 8px;">Message:</p>
            <div style="background:#f8fafc;border-left:4px solid #1d4ed8;border-radius:6px;padding:16px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
            <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
              Reply directly to this email to respond to ${data.fullName}.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:16px 36px;border-top:1px solid #e5e7eb;">
            <p style="font-size:11px;color:#9ca3af;margin:0;">
              This message was submitted via the contact form at anupamvidyasadan.edu.np
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationEmailHtml(data: {
  fullName: string;
  subject: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f7fb;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);padding:28px 36px;">
            <h1 style="color:#fff;font-size:20px;margin:0;">✅ Message Received</h1>
            <p style="color:#93c5fd;font-size:13px;margin:6px 0 0;">Anupam Vidya Sadan, Kathmandu</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            <p style="font-size:16px;color:#111827;">Dear <strong>${escapeHtml(data.fullName)}</strong>,</p>
            <p style="font-size:14px;color:#374151;line-height:1.7;">
              Thank you for reaching out to us. We have received your message regarding
              <strong>"${escapeHtml(data.subject)}"</strong> and will get back to you within
              <strong>1–2 business days</strong>.
            </p>
            <p style="font-size:14px;color:#374151;line-height:1.7;">
              If your enquiry is urgent, please call us at <strong>+977-01-4412345</strong>
              during office hours (Sunday–Friday, 9:00 AM – 4:00 PM).
            </p>
            <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:24px 0;">
              <p style="font-size:13px;color:#1d4ed8;margin:0;font-weight:600;">
                Anupam Vidya Sadan
              </p>
              <p style="font-size:12px;color:#6b7280;margin:4px 0 0;">
                Lazimpat, Kathmandu, Bagmati Province, Nepal
              </p>
            </div>
            <p style="font-size:13px;color:#9ca3af;">
              Please do not reply to this email. This is an automated confirmation.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 36px;border-top:1px solid #e5e7eb;">
            <p style="font-size:11px;color:#9ca3af;margin:0;">© Anupam Vidya Sadan. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Simple HTML escape for user content inside email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="font-size:12px;color:#6b7280;font-weight:600;padding:6px 0 2px;">${label}</td>
    </tr>
    <tr>
      <td style="font-size:14px;color:#111827;padding-bottom:14px;border-bottom:1px solid #f3f4f6;">${value}</td>
    </tr>`;
}
