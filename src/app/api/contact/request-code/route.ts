import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  generateVerificationCode,
  hashContactIp,
  hashVerificationCode,
  isValidEmail,
  normalizeEmail,
  signFallbackToken,
  verificationExpiry,
  verificationSecret,
} from "@/lib/contact-verification";
import {
  hasContactEmailDelivery,
  sendContactEmail,
  verificationEmailHtml,
} from "@/lib/contact-email";
import { getSiteSettings } from "@/lib/content";
import {
  dbInsert,
  dbSelect,
  dbUpdate,
  hasSupabase,
} from "@/lib/supabase-rest";
import {
  clientIp,
  isRateLimited,
  rateLimitKey,
} from "@/lib/rate-limit";

const RESEND_COOLDOWN_MS = 60 * 1000;
const HOURLY_EMAIL_LIMIT = 4;
const HOURLY_IP_LIMIT = 8;

const rateSecret =
  process.env.CONTACT_VERIFICATION_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  "portfolio-contact-verification";

type VerificationRow = {
  id: string;
  email: string;
  created_at: string;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function enableFallback(
  verificationId: string,
  email: string,
  reason: string,
) {
  const now = new Date().toISOString();

  await dbUpdate(
    "contact_email_verifications",
    `id=eq.${encodeURIComponent(verificationId)}`,
    {
      fallback_allowed_at: now,
      fallback_reason: reason,
    },
  );

  return NextResponse.json({
    ok: true,
    mode: "fallback",
    fallbackToken: signFallbackToken(verificationId, email),
    message:
      "Email verification is temporarily unavailable. Your message can still be submitted.",
    expiresIn: 600,
  });
}

export async function POST(request: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "Contact submission is not configured yet." },
      { status: 503 },
    );
  }

  const settings = await getSiteSettings();

  if (settings.contactMode !== "form") {
    return NextResponse.json(
      { error: "The contact form is currently unavailable." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const email = normalizeEmail(input.email);
  const website = clean(input.website, 200);

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 422 },
    );
  }

  /*
   * Verification disabled intentionally from Admin.
   * No Resend call and no OTP row are needed.
   */
  if (!settings.contactRequireVerification) {
    return NextResponse.json({
      ok: true,
      mode: "unverified",
    });
  }

  if (!verificationSecret()) {
    return NextResponse.json(
      { error: "Email verification is not configured yet." },
      { status: 503 },
    );
  }

  /*
   * Honeypot: fake the verification response.
   * Real visitors never fill this field.
   */
  if (website) {
    return NextResponse.json({
      ok: true,
      mode: "verification",
      verificationId: randomUUID(),
      expiresIn: 600,
      resendAfter: 60,
    });
  }

  const ip = clientIp(request);
  const inMemoryKey = rateLimitKey(ip, rateSecret, "contact-code");

  if (isRateLimited(inMemoryKey, 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many verification requests. Please try again later." },
      { status: 429 },
    );
  }

  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const ipHash = hashContactIp(ip);

  try {
    const latest = await dbSelect<VerificationRow>(
      "contact_email_verifications",
      `select=id,email,created_at&email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=1`,
    );

    if (latest[0]) {
      const age = now - new Date(latest[0].created_at).getTime();

      if (age >= 0 && age < RESEND_COOLDOWN_MS) {
        return NextResponse.json(
          {
            error: "Please wait before requesting another code.",
            retryAfter: Math.ceil((RESEND_COOLDOWN_MS - age) / 1000),
          },
          { status: 429 },
        );
      }
    }

    const recentEmailRequests = await dbSelect<{ id: string }>(
      "contact_email_verifications",
      `select=id&email=eq.${encodeURIComponent(email)}&created_at=gte.${encodeURIComponent(hourAgo)}&limit=${HOURLY_EMAIL_LIMIT}`,
    );

    if (recentEmailRequests.length >= HOURLY_EMAIL_LIMIT) {
      return NextResponse.json(
        { error: "Too many codes were requested for this email. Try again later." },
        { status: 429 },
      );
    }

    const recentIpRequests = await dbSelect<{ id: string }>(
      "contact_email_verifications",
      `select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(hourAgo)}&limit=${HOURLY_IP_LIMIT}`,
    );

    if (recentIpRequests.length >= HOURLY_IP_LIMIT) {
      return NextResponse.json(
        { error: "Too many verification requests. Please try again later." },
        { status: 429 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Could not start contact verification. Please try again." },
      { status: 503 },
    );
  }

  const verificationId = randomUUID();
  const code = generateVerificationCode();
  const expiresAt = verificationExpiry();
  const codeHash = hashVerificationCode(verificationId, email, code);

  try {
    await dbInsert("contact_email_verifications", {
      id: verificationId,
      email,
      code_hash: codeHash,
      attempts: 0,
      ip_hash: ipHash,
      expires_at: expiresAt.toISOString(),
      fallback_allowed_at: null,
      fallback_reason: null,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not start contact verification. Please try again." },
      { status: 503 },
    );
  }

  /*
   * Verification is enabled, but email delivery is unavailable.
   * The server grants a short-lived fallback token so the visitor
   * can still submit an explicitly unverified message.
   */
  if (!hasContactEmailDelivery()) {
    try {
      return await enableFallback(
        verificationId,
        email,
        "email_delivery_not_configured",
      );
    } catch {
      return NextResponse.json(
        { error: "Contact submission is temporarily unavailable." },
        { status: 503 },
      );
    }
  }

  try {
    await sendContactEmail({
      to: email,
      subject: "Your portfolio email verification code",
      html: verificationEmailHtml(code),
    });
  } catch {
    try {
      return await enableFallback(
        verificationId,
        email,
        "email_provider_unavailable",
      );
    } catch {
      return NextResponse.json(
        { error: "Contact submission is temporarily unavailable." },
        { status: 503 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    mode: "verification",
    verificationId,
    expiresIn: 600,
    resendAfter: 60,
  });
}
