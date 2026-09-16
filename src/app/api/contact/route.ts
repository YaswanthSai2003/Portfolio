import {
  randomInt,
} from "node:crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  sendContactEmail,
} from "@/lib/contact-email";

import {
  normalizeEmail,
  verifyFallbackToken,
  verifyVerificationToken,
  verificationSecret,
} from "@/lib/contact-verification";

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

const allowedTypes =
  new Set([
    "job",
    "project",
    "collaboration",
    "technical",
    "other",
  ]);

const MAX_MESSAGES =
  5;

const WINDOW_MS =
  10 * 60 * 1000;

/*
 * Fallback submissions
 * are intentionally much
 * stricter.
 */
const MAX_FALLBACK_MESSAGES =
  2;

const FALLBACK_WINDOW_MS =
  60 *
  60 *
  1000;

const rateSecret =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.CONTACT_VERIFICATION_SECRET ||
  "portfolio-contact";

type VerificationRow = {
  id: string;
  email: string;
  verified_at: string | null;
  used_at: string | null;
  fallback_allowed_at:
    | string
    | null;
  fallback_reason:
    | string
    | null;
};

function clean(
  value: unknown,
  max: number,
) {
  return typeof value === "string"
    ? value
        .trim()
        .slice(
          0,
          max,
        )
    : "";
}

function escapeHtml(
  value: string,
) {
  return value.replace(
    /[&<>'"]/g,

    (character) =>
      ({
        "&":
          "&amp;",

        "<":
          "&lt;",

        ">":
          "&gt;",

        "'":
          "&#39;",

        '"':
          "&quot;",
      })[
        character
      ] ??
      character,
  );
}

function getIstDateStamp() {
  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Asia/Kolkata",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      },
    ).formatToParts(
      new Date(),
    );

  const year =
    parts.find(
      (part) =>
        part.type ===
        "year",
    )?.value ?? "";

  const month =
    parts.find(
      (part) =>
        part.type ===
        "month",
    )?.value ?? "";

  const day =
    parts.find(
      (part) =>
        part.type ===
        "day",
    )?.value ?? "";

  return `${year}${month}${day}`;
}

function createMessageReference() {
  const randomNumber =
    randomInt(
      0,
      10_000,
    )
      .toString()
      .padStart(
        4,
        "0",
      );

  return `MSG-${getIstDateStamp()}-${randomNumber}`;
}

export async function POST(
  request: NextRequest,
) {
  const ip =
    clientIp(
      request,
    );

  const key =
    rateLimitKey(
      ip,
      rateSecret,
      "contact",
    );

  if (
    isRateLimited(
      key,
      MAX_MESSAGES,
      WINDOW_MS,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many messages. Please try again later.",
      },
      {
        status: 429,
      },
    );
  }

  const body =
    await request
      .json()
      .catch(
        () => null,
      );

  if (
    !body ||
    typeof body !==
      "object"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid request.",
      },
      {
        status: 400,
      },
    );
  }

  const input =
    body as Record<
      string,
      unknown
    >;

  /*
   * Honeypot.
   */
  if (
    clean(
      input.website,
      200,
    )
  ) {
    return NextResponse.json({
      ok: true,

      reference:
        "MSG-ACCEPTED",
    });
  }

  const type =
    clean(
      input.type,
      32,
    );

  const name =
    clean(
      input.name,
      80,
    );

  const email =
    normalizeEmail(
      input.email,
    );

  const company =
    clean(
      input.company,
      120,
    );

  const message =
    clean(
      input.message,
      3000,
    );

  const verificationToken =
    clean(
      input.verificationToken,
      4096,
    );

  const fallbackToken =
    clean(
      input.fallbackToken,
      4096,
    );

  if (
    !allowedTypes.has(
      type,
    ) ||
    name.length < 2 ||
    message.length <
      20 ||
    !/^\S+@\S+\.\S+$/.test(
      email,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please check the submitted fields.",
      },
      {
        status: 422,
      },
    );
  }

  if (
    !hasSupabase() ||
    !verificationSecret()
  ) {
    return NextResponse.json(
      {
        error:
          "Contact verification is not configured yet.",
      },
      {
        status: 503,
      },
    );
  }

  const verifiedPayload =
    verificationToken
      ? verifyVerificationToken(
          verificationToken,
        )
      : null;

  const fallbackPayload =
    fallbackToken
      ? verifyFallbackToken(
          fallbackToken,
        )
      : null;

  let mode:
    | "verified"
    | "fallback";

  let tokenId:
    string;

  if (
    verifiedPayload &&
    verifiedPayload.email ===
      email
  ) {
    mode =
      "verified";

    tokenId =
      verifiedPayload.id;
  } else if (
    fallbackPayload &&
    fallbackPayload.email ===
      email
  ) {
    mode =
      "fallback";

    tokenId =
      fallbackPayload.id;
  } else {
    return NextResponse.json(
      {
        error:
          "Please verify your email before sending the message.",
      },
      {
        status: 401,
      },
    );
  }

  /*
   * Additional strict rate
   * limit for unverified
   * fallback submissions.
   */
  if (
    mode ===
    "fallback"
  ) {
    const fallbackKey =
      rateLimitKey(
        ip,
        rateSecret,
        "contact-fallback",
      );

    if (
      isRateLimited(
        fallbackKey,
        MAX_FALLBACK_MESSAGES,
        FALLBACK_WINDOW_MS,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Too many fallback submissions. Please try again later.",
        },
        {
          status: 429,
        },
      );
    }
  }

  let verification:
    | VerificationRow
    | undefined;

  try {
    const rows =
      await dbSelect<VerificationRow>(
        "contact_email_verifications",

        `select=id,email,verified_at,used_at,fallback_allowed_at,fallback_reason&id=eq.${encodeURIComponent(
          tokenId,
        )}&email=eq.${encodeURIComponent(
          email,
        )}&limit=1`,
      );

    verification =
      rows[0];
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not validate the contact request.",
      },
      {
        status: 503,
      },
    );
  }

  if (
    !verification ||
    verification.used_at
  ) {
    return NextResponse.json(
      {
        error:
          "This contact request is no longer valid.",
      },
      {
        status: 401,
      },
    );
  }

  if (
    mode ===
      "verified" &&
    !verification
      .verified_at
  ) {
    return NextResponse.json(
      {
        error:
          "Email verification was not completed.",
      },
      {
        status: 401,
      },
    );
  }

  if (
    mode ===
      "fallback" &&
    !verification
      .fallback_allowed_at
  ) {
    return NextResponse.json(
      {
        error:
          "Fallback submission is not authorized.",
      },
      {
        status: 401,
      },
    );
  }

  const emailVerified =
    mode ===
    "verified";

  const reference =
    createMessageReference();

  let stored =
    false;

  try {
    await dbInsert(
      "contact_messages",
      {
        reference,

        verification_id:
          verification.id,

        type,

        name,

        email,

        company:
          company ||
          null,

        message,

        status:
          "new",

        email_verified:
          emailVerified,

        delivery_mode:
          mode,
      },
    );

    stored =
      true;
  } catch {
    stored =
      false;
  }

  const to =
    process.env
      .CONTACT_TO_EMAIL ||
    "";

  let mailed =
    false;

  /*
   * Resend might have recovered
   * between OTP failure and
   * final message submission.
   *
   * If so, still send the
   * notification to you.
   */
  if (to) {
    const readableType =
      type
        .replaceAll(
          "-",
          " ",
        )
        .replace(
          /\b\w/g,

          (
            character,
          ) =>
            character
              .toUpperCase(),
        );

    const verificationLabel =
      emailVerified
        ? "verified email"
        : "UNVERIFIED FALLBACK";

    const html = `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 680px;
          margin: auto;
          padding: 28px;
          color: #111;
        "
      >
        <p
          style="
            font-size: 12px;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: #666;
          "
        >
          Portfolio enquiry ·
          ${escapeHtml(
            reference,
          )} ·
          ${escapeHtml(
            verificationLabel,
          )}
        </p>

        <h1
          style="
            font-size: 28px;
            margin: 18px 0;
          "
        >
          ${escapeHtml(
            readableType,
          )}
        </h1>

        ${
          !emailVerified
            ? `
              <div
                style="
                  margin: 18px 0;
                  padding: 14px 16px;
                  background: #fff4e6;
                  border: 1px solid #ffd8a8;
                  font-size: 13px;
                  line-height: 1.6;
                "
              >
                Email verification was unavailable when this message was submitted.
                Treat the sender address as unverified.
              </div>
            `
            : ""
        }

        <p>
          <strong>
            From:
          </strong>

          ${escapeHtml(
            name,
          )}

          &lt;${escapeHtml(
            email,
          )}&gt;
        </p>

        ${
          company
            ? `
              <p>
                <strong>
                  Company:
                </strong>

                ${escapeHtml(
                  company,
                )}
              </p>
            `
            : ""
        }

        <p
          style="
            white-space: pre-wrap;
            line-height: 1.7;
            margin-top: 26px;
          "
        >
          ${escapeHtml(
            message,
          )}
        </p>

        <hr
          style="
            border: 0;
            border-top: 1px solid #e5e5e5;
            margin: 30px 0 18px;
          "
        />

        <p
          style="
            margin: 0;
            font-size: 11px;
            color: #777;
          "
        >
          Reference:
          ${escapeHtml(
            reference,
          )}
        </p>
      </div>
    `;

    try {
      await sendContactEmail({
        to,

        replyTo:
          email,

        subject:
          emailVerified
            ? `[Portfolio] ${readableType} — ${name}`
            : `[Portfolio][UNVERIFIED] ${readableType} — ${name}`,

        html,
      });

      mailed =
        true;
    } catch {
      mailed =
        false;
    }
  }

  /*
   * Database is our durable
   * fallback.
   *
   * If neither DB nor email
   * works, report failure.
   */
  if (
    !stored &&
    !mailed
  ) {
    return NextResponse.json(
      {
        error:
          "Message delivery is temporarily unavailable.",
      },
      {
        status: 503,
      },
    );
  }

  await dbUpdate(
    "contact_email_verifications",

    `id=eq.${encodeURIComponent(
      verification.id,
    )}&used_at=is.null`,

    {
      used_at:
        new Date()
          .toISOString(),
    },
  ).catch(
    () => undefined,
  );

  return NextResponse.json({
    ok: true,

    reference,

    emailVerified,

    deliveryMode:
      mode,
  });
}