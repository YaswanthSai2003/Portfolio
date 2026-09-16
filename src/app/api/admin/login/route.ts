import { NextResponse } from "next/server";
import {
  adminAuthConfigured,
  createAdminSessionToken,
  setAdminCookie,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { writeAudit } from "@/lib/audit";
import { clientIp, isRateLimited, rateLimitKey } from "@/lib/rate-limit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const rateSecret = process.env.ADMIN_SESSION_SECRET || "portfolio-admin-login";

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
  }

  const key = rateLimitKey(clientIp(request), rateSecret, "admin-login");
  if (isRateLimited(key, MAX_ATTEMPTS, WINDOW_MS)) {
    await writeAudit("LOGIN_RATE_LIMITED", "admin");
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || !verifyAdminPassword(body.password)) {
    await writeAudit("LOGIN_FAILED", "admin");
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }
  await setAdminCookie(createAdminSessionToken());
  await writeAudit("LOGIN_SUCCESS", "admin");
  return NextResponse.json({ ok: true });
}
