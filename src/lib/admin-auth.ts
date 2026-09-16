import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function equal(a: string, b: string) {
  const ah = Buffer.from(a);
  const bh = Buffer.from(b);
  return ah.length === bh.length && timingSafeEqual(ah, bh);
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export function verifyAdminPassword(input: string) {
  const configured = process.env.ADMIN_PASSWORD || "";
  if (!configured || !input) return false;
  const a = createHmac("sha256", "portfolio-password").update(input).digest("hex");
  const b = createHmac("sha256", "portfolio-password").update(configured).digest("hex");
  return equal(a, b);
}

export function createAdminSessionToken() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `admin:${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token || !secret()) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const expected = sign(payload);
  if (!equal(signature, expected)) return false;
  const [, rawExpiry] = payload.split(":");
  const expiry = Number(rawExpiry);
  return Number.isFinite(expiry) && expiry > Math.floor(Date.now() / 1000);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
