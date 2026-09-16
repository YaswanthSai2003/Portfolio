import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Generates a per-request nonce for inline <script> tags (theme-boot, JSON-LD)
// and sets a Content-Security-Policy header. Next.js automatically applies
// the same nonce to its own injected scripts when it detects this header
// shape, so app code only needs to thread the nonce to the scripts it
// controls itself (see src/app/layout.tsx and src/app/(site)/page.tsx).
//
// img-src additionally allows the configured Supabase project host, because
// admin-uploaded media can be served directly from Supabase Storage
// (public bucket) rather than from /public.
function supabaseHost(): string | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const host = supabaseHost();

  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data:${host ? ` https://${host}` : ""}`,
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
