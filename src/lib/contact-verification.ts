import {
  createHmac,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

const OTP_TTL_MS = 10 * 60 * 1000;
const TOKEN_TTL_MS = 15 * 60 * 1000;
const FALLBACK_TOKEN_TTL_MS = 10 * 60 * 1000;

export type ContactVerificationTokenPayload = {
  kind: "verified";
  id: string;
  email: string;
  exp: number;
};

export type ContactFallbackTokenPayload = {
  kind: "fallback";
  id: string;
  email: string;
  exp: number;
};

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email) && email.length <= 160;
}

export function verificationSecret() {
  return (
    process.env.CONTACT_VERIFICATION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    ""
  );
}

export function generateVerificationCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function verificationExpiry() {
  return new Date(Date.now() + OTP_TTL_MS);
}

export function hashVerificationCode(
  verificationId: string,
  email: string,
  code: string,
) {
  const secret = verificationSecret();

  if (!secret) {
    throw new Error("Contact verification secret is not configured.");
  }

  return createHmac("sha256", secret)
    .update(`${verificationId}:${email}:${code}`)
    .digest("hex");
}

export function verificationCodeMatches(
  storedHash: string,
  verificationId: string,
  email: string,
  code: string,
) {
  const candidate = hashVerificationCode(verificationId, email, code);
  const stored = Buffer.from(storedHash, "hex");
  const supplied = Buffer.from(candidate, "hex");

  return (
    stored.length === supplied.length &&
    timingSafeEqual(stored, supplied)
  );
}

function signPayload(
  payload: ContactVerificationTokenPayload | ContactFallbackTokenPayload,
) {
  const secret = verificationSecret();

  if (!secret) {
    throw new Error("Contact verification secret is not configured.");
  }

  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(body)
    .digest("base64url");

  return `${body}.${signature}`;
}

function verifySignedPayload(
  token: string,
): ContactVerificationTokenPayload | ContactFallbackTokenPayload | null {
  const secret = verificationSecret();

  if (!secret) {
    return null;
  }

  const [body, signature, ...rest] = token.split(".");

  if (!body || !signature || rest.length > 0) {
    return null;
  }

  const expected = createHmac("sha256", secret)
    .update(body)
    .digest("base64url");

  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<
      ContactVerificationTokenPayload | ContactFallbackTokenPayload
    >;

    if (
      (payload.kind !== "verified" && payload.kind !== "fallback") ||
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now()
    ) {
      return null;
    }

    return {
      kind: payload.kind,
      id: payload.id,
      email: normalizeEmail(payload.email),
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export function signVerificationToken(id: string, email: string) {
  return signPayload({
    kind: "verified",
    id,
    email: normalizeEmail(email),
    exp: Date.now() + TOKEN_TTL_MS,
  });
}

export function verifyVerificationToken(
  token: string,
): ContactVerificationTokenPayload | null {
  const payload = verifySignedPayload(token);

  if (!payload || payload.kind !== "verified") {
    return null;
  }

  return payload;
}

export function signFallbackToken(id: string, email: string) {
  return signPayload({
    kind: "fallback",
    id,
    email: normalizeEmail(email),
    exp: Date.now() + FALLBACK_TOKEN_TTL_MS,
  });
}

export function verifyFallbackToken(
  token: string,
): ContactFallbackTokenPayload | null {
  const payload = verifySignedPayload(token);

  if (!payload || payload.kind !== "fallback") {
    return null;
  }

  return payload;
}

export function hashContactIp(ip: string) {
  const secret = verificationSecret();

  if (!secret || !ip) {
    return "unknown";
  }

  return createHmac("sha256", secret)
    .update(`contact-ip:${ip}`)
    .digest("hex")
    .slice(0, 32);
}
