import { createHmac, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { dbInsert, hasSupabase } from "@/lib/supabase-rest";
import { clientIp, isRateLimited, rateLimitKey } from "@/lib/rate-limit";

const COOKIE_NAME = "portfolio_sid";
const MAX_EVENTS = 60;
const WINDOW_MS = 10 * 60 * 1000;

function deviceClass(ua: string) {
  const lower = ua.toLowerCase();
  if (/ipad|tablet|kindle/.test(lower)) return "tablet";
  if (/mobi|iphone|android/.test(lower)) return "mobile";
  return "desktop";
}

function browserName(ua: string) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  return "Other";
}

function osName(ua: string) {
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

function hashIp(ip: string) {
  const key = process.env.ANALYTICS_HASH_SECRET || process.env.ADMIN_SESSION_SECRET || "";
  return ip && key ? createHmac("sha256", key).update(ip).digest("hex").slice(0, 24) : null;
}

export async function POST(request: Request) {
  if (!hasSupabase()) return NextResponse.json({ ok: true, stored: false });

  const rateSecret = process.env.ANALYTICS_HASH_SECRET || process.env.ADMIN_SESSION_SECRET || "portfolio-analytics";
  const key = rateLimitKey(clientIp(request), rateSecret, "analytics");
  if (isRateLimited(key, MAX_EVENTS, WINDOW_MS)) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const eventType = typeof body.eventType === "string" ? body.eventType.slice(0, 50) : "page_view";
  const path = typeof body.path === "string" ? body.path.slice(0, 500) : "/";
  const projectSlug = typeof body.projectSlug === "string" ? body.projectSlug.slice(0, 120) : null;
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 800) : "";
  const ua = request.headers.get("user-agent") || "";
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)portfolio_sid=([^;]+)/);
  const sessionId = match?.[1] || randomBytes(12).toString("hex");
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;

  try {
    await dbInsert("analytics_events", {
      session_id: sessionId,
      event_type: eventType,
      path,
      project_slug: projectSlug,
      referrer,
      user_agent: ua.slice(0, 800),
      device_class: deviceClass(ua),
      browser: browserName(ua),
      os: osName(ua),
      country,
      ip_hash: hashIp(forwarded),
    });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }

  const response = NextResponse.json({ ok: true, stored: true });
  if (!match) {
    response.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
