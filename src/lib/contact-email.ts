type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function resendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.CONTACT_FROM_EMAIL || "",
  };
}

export function hasContactEmailDelivery() {
  const { apiKey, from } = resendConfig();

  return Boolean(apiKey && from);
}

export async function sendContactEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailInput) {
  const { apiKey, from } = resendConfig();

  if (!apiKey || !from) {
    throw new Error(
      "Contact email delivery is not configured.",
    );
  }

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        ...(replyTo
          ? { reply_to: replyTo }
          : {}),
      }),

      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail =
      await response
        .text()
        .catch(() => "");

    throw new Error(
      detail ||
        "Email provider rejected the request.",
    );
  }
}

export function verificationEmailHtml(
  code: string,
) {
  return `
    <div
      style="
        background:#f3f4f4;
        padding:40px 18px;
        font-family:Arial,sans-serif;
        color:#141416;
      "
    >
      <div
        style="
          max-width:560px;
          margin:0 auto;
          background:#ffffff;
          padding:36px;
          border-radius:16px;
        "
      >
        <p
          style="
            margin:0 0 24px;
            font-size:11px;
            letter-spacing:.14em;
            text-transform:uppercase;
            color:#74777a;
          "
        >
          Yaswanth Kadhati · Portfolio
        </p>

        <h1
          style="
            margin:0;
            font-size:28px;
            line-height:1.2;
            font-weight:600;
          "
        >
          Verify your email
        </h1>

        <p
          style="
            margin:16px 0 28px;
            font-size:14px;
            line-height:1.7;
            color:#55595c;
          "
        >
          Enter this code on the portfolio contact
          form to send your message.
        </p>

        <div
          style="
            margin:0 0 28px;
            padding:20px 24px;
            background:#f4f5f5;
            border-radius:12px;
            text-align:center;
            font-size:32px;
            font-weight:700;
            letter-spacing:.28em;
          "
        >
          ${code}
        </div>

        <p
          style="
            margin:0;
            font-size:12px;
            line-height:1.7;
            color:#777b7e;
          "
        >
          This code expires in 10 minutes.
          If you did not try to contact Yaswanth,
          you can ignore this email.
        </p>
      </div>
    </div>
  `;
}