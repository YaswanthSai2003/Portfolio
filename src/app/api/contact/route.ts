import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { dbInsert, hasSupabase } from "@/lib/supabase-rest";
import { clientIp, isRateLimited, rateLimitKey } from "@/lib/rate-limit";

const allowedTypes = new Set(["job", "project", "collaboration", "technical", "other"]);
const MAX_MESSAGES = 5;
const WINDOW_MS = 10 * 60 * 1000;
const rateSecret = process.env.ADMIN_SESSION_SECRET || "portfolio-contact";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[character] ?? character));
}

export async function POST(request: NextRequest) {
  const key = rateLimitKey(clientIp(request), rateSecret, "contact");
  if (isRateLimited(key, MAX_MESSAGES, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  if (clean(input.website, 200)) {
    return NextResponse.json({ ok: true, reference: "MSG-ACCEPTED" });
  }

  const type = clean(input.type, 32);
  const name = clean(input.name, 80);
  const email = clean(input.email, 160).toLowerCase();
  const company = clean(input.company, 120);
  const message = clean(input.message, 3000);

  if (!allowedTypes.has(type) || name.length < 2 || message.length < 20 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please check the submitted fields." }, { status: 422 });
  }

  const reference = `MSG-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomBytes(2).toString("hex").toUpperCase()}`;
  let stored = false;

  if (hasSupabase()) {
    try {
      await dbInsert("contact_messages", {
        reference,
        type,
        name,
        email,
        company: company || null,
        message,
        status: "new",
      });
      stored = true;
    } catch {
      stored = false;
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  let mailed = false;

  if (apiKey && from && to) {
    const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:28px;color:#111"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase">Portfolio enquiry · ${escapeHtml(reference)}</p><h1 style="font-size:28px;margin:18px 0">${escapeHtml(type.replaceAll("-", " "))}</h1><p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}<p style="white-space:pre-wrap;line-height:1.7;margin-top:26px">${escapeHtml(message)}</p></div>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Portfolio] ${type} — ${name}`,
        html,
      }),
    });
    mailed = response.ok;
  }

  if (!stored && !mailed) {
    return NextResponse.json({ error: "Message delivery is not configured yet." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, reference });
}
