import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  isValidEmail,
  normalizeEmail,
  signVerificationToken,
  verificationCodeMatches,
  verificationSecret,
} from "@/lib/contact-verification";

import {
  dbSelect,
  dbUpdate,
  hasSupabase,
} from "@/lib/supabase-rest";

import {
  clientIp,
  isRateLimited,
  rateLimitKey,
} from "@/lib/rate-limit";

const MAX_ATTEMPTS = 5;

const rateSecret =
  process.env.CONTACT_VERIFICATION_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  "portfolio-contact-verification";

type VerificationRow = {
  id: string;
  email: string;
  code_hash: string;
  attempts: number;
  expires_at: string;
  verified_at: string | null;
  used_at: string | null;
};

function clean(
  value: unknown,
  max: number,
) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

export async function POST(
  request: NextRequest,
) {
  if (
    !hasSupabase() ||
    !verificationSecret()
  ) {
    return NextResponse.json(
      {
        error:
          "Email verification is not configured yet.",
      },
      { status: 503 },
    );
  }

  const ipKey =
    rateLimitKey(
      clientIp(request),
      rateSecret,
      "contact-verify",
    );

  if (
    isRateLimited(
      ipKey,
      30,
      10 * 60 * 1000,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many verification attempts. Please try again later.",
      },
      { status: 429 },
    );
  }

  const body =
    await request
      .json()
      .catch(() => null);

  if (
    !body ||
    typeof body !== "object"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid request.",
      },
      { status: 400 },
    );
  }

  const input =
    body as Record<
      string,
      unknown
    >;

  const verificationId =
    clean(
      input.verificationId,
      80,
    );

  const email =
    normalizeEmail(
      input.email,
    );

  const code =
    clean(
      input.code,
      6,
    );

  if (
    !verificationId ||
    !isValidEmail(email) ||
    !/^\d{6}$/.test(code)
  ) {
    return NextResponse.json(
      {
        error:
          "Enter the 6-digit verification code.",
      },
      { status: 422 },
    );
  }

  let row:
    | VerificationRow
    | undefined;

  try {
    const rows =
      await dbSelect<VerificationRow>(
        "contact_email_verifications",

        `select=id,email,code_hash,attempts,expires_at,verified_at,used_at&id=eq.${encodeURIComponent(
          verificationId,
        )}&email=eq.${encodeURIComponent(
          email,
        )}&limit=1`,
      );

    row = rows[0];
  } catch {
    return NextResponse.json(
      {
        error:
          "Verification is temporarily unavailable.",
      },
      { status: 503 },
    );
  }

  if (
    !row ||
    row.used_at
  ) {
    return NextResponse.json(
      {
        error:
          "This verification request is no longer valid.",
      },
      { status: 400 },
    );
  }

  if (row.verified_at) {
    return NextResponse.json({
      ok: true,

      verificationToken:
        signVerificationToken(
          row.id,
          row.email,
        ),
    });
  }

  if (
    new Date(
      row.expires_at,
    ).getTime() <= Date.now()
  ) {
    return NextResponse.json(
      {
        error:
          "This code has expired. Request a new one.",
      },
      { status: 410 },
    );
  }

  if (
    row.attempts >=
    MAX_ATTEMPTS
  ) {
    return NextResponse.json(
      {
        error:
          "Too many incorrect attempts. Request a new code.",
      },
      { status: 429 },
    );
  }

  if (
    !verificationCodeMatches(
      row.code_hash,
      row.id,
      row.email,
      code,
    )
  ) {
    const nextAttempts =
      row.attempts + 1;

    await dbUpdate(
      "contact_email_verifications",

      `id=eq.${encodeURIComponent(
        row.id,
      )}`,

      {
        attempts:
          nextAttempts,
      },
    ).catch(
      () => undefined,
    );

    return NextResponse.json(
      {
        error:
          nextAttempts >=
          MAX_ATTEMPTS
            ? "Too many incorrect attempts. Request a new code."
            : "That code is incorrect. Please try again.",

        attemptsRemaining:
          Math.max(
            0,
            MAX_ATTEMPTS -
              nextAttempts,
          ),
      },

      {
        status:
          nextAttempts >=
          MAX_ATTEMPTS
            ? 429
            : 422,
      },
    );
  }

  const verifiedAt =
    new Date()
      .toISOString();

  try {
    await dbUpdate(
      "contact_email_verifications",

      `id=eq.${encodeURIComponent(
        row.id,
      )}`,

      {
        verified_at:
          verifiedAt,
      },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Verification is temporarily unavailable.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,

    verificationToken:
      signVerificationToken(
        row.id,
        row.email,
      ),
  });
}