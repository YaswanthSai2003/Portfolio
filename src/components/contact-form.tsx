"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

type Status =
  | "idle"
  | "sending-code"
  | "verifying"
  | "sending"
  | "sent"
  | "error";

type ContactPayload = {
  website: string;
  name: string;
  email: string;
  type: string;
  company: string;
  message: string;
};

type ContactFormProps = {
  requireVerification: boolean;
};

const inputClass = `
  w-full
  border-0
  bg-transparent
  py-1
  text-[13px]
  text-black/80
  outline-none
  ring-0
  placeholder:text-black/30
  focus:outline-none
  focus:ring-0
  focus-visible:outline-none
  focus-visible:ring-0
  dark:text-white/80
  dark:placeholder:text-white/30
`;

const labelClass = `
  block
  border-b
  border-black/10
  py-5
  transition-colors
  duration-200
  focus-within:border-black/30
  dark:border-white/10
  dark:focus-within:border-white/30
`;

const labelTextClass = `
  mb-2
  block
  font-[var(--font-mono)]
  text-[8px]
  uppercase
  tracking-[0.09em]
  text-black/45
  dark:text-white/45
`;

function formValue(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@");

  if (!domain) {
    return email;
  }

  const visible = local.slice(0, Math.min(2, local.length));

  return `${visible}${"•".repeat(
    Math.max(3, local.length - visible.length),
  )}@${domain}`;
}

export function ContactForm({ requireVerification }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [pendingPayload, setPendingPayload] =
    useState<ContactPayload | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [sentWasVerified, setSentWasVerified] = useState(true);

  useEffect(() => {
    if (!verificationOpen || resendSeconds <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [verificationOpen, resendSeconds]);

  function resetVerification() {
    setVerificationOpen(false);
    setVerificationId("");
    setVerificationEmail("");
    setVerificationCode("");
    setVerificationToken("");
    setVerificationError("");
    setPendingPayload(null);
    setResendSeconds(0);
  }

  async function sendMessage(
    payload: ContactPayload,
    options: {
      verificationToken?: string;
      fallbackToken?: string;
    } = {},
  ) {
    setStatus("sending");
    setVerificationError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          ...options,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.error ||
          "The message couldn't be sent. Please try again.";

        if (verificationOpen) {
          setVerificationError(message);
        } else {
          setErrorMessage(message);
        }

        setStatus("error");
        return;
      }

      setReference(data.reference || "MSG-RECEIVED");
      setSentWasVerified(data.emailVerified !== false);
      setStatus("sent");
      setVerificationOpen(false);
      setPendingPayload(null);
      setVerificationToken("");
      formRef.current?.reset();

      try {
        navigator.sendBeacon(
          "/api/analytics",
          new Blob(
            [
              JSON.stringify({
                eventType: "contact_submit",
                path: window.location.pathname,
              }),
            ],
            { type: "application/json" },
          ),
        );
      } catch {
        // Analytics is optional.
      }
    } catch {
      const message =
        "Couldn't reach the server. Check your connection and try again.";

      if (verificationOpen) {
        setVerificationError(message);
      } else {
        setErrorMessage(message);
      }

      setStatus("error");
    }
  }

  async function requestVerificationCode(payload: ContactPayload) {
    setErrorMessage("");
    setVerificationError("");
    setStatus("sending-code");

    try {
      const response = await fetch("/api/contact/request-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: payload.email,
          website: payload.website,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.error ||
          "Couldn't start email verification. Please try again.";

        if (verificationOpen) {
          setVerificationError(message);

          if (data?.retryAfter) {
            setResendSeconds(Number(data.retryAfter) || 0);
          }

          setStatus("idle");
        } else {
          setErrorMessage(message);
          setStatus("error");
        }

        return;
      }

      /*
       * Admin intentionally disabled verification.
       * No OTP is sent; the backend still applies stricter
       * limits and stores this as an unverified message.
       */
      if (data.mode === "unverified") {
        setVerificationOpen(false);
        setPendingPayload(null);
        await sendMessage(payload);
        return;
      }

      /*
       * Verification is enabled but Resend is unavailable.
       * Only the server can issue this signed fallback token.
       */
      if (data.mode === "fallback" && data.fallbackToken) {
        setVerificationOpen(false);
        setPendingPayload(null);

        await sendMessage(payload, {
          fallbackToken: String(data.fallbackToken),
        });

        return;
      }

      setPendingPayload(payload);
      setVerificationId(data.verificationId || "");
      setVerificationEmail(payload.email.trim().toLowerCase());
      setVerificationCode("");
      setVerificationToken("");
      setResendSeconds(Number(data.resendAfter) || 60);
      setVerificationOpen(true);
      setStatus("idle");
    } catch {
      const message =
        "Couldn't reach the verification service. Check your connection and try again.";

      if (verificationOpen) {
        setVerificationError(message);
        setStatus("idle");
      } else {
        setErrorMessage(message);
        setStatus("error");
      }
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const payload: ContactPayload = {
      website: formValue(data, "website"),
      name: formValue(data, "name"),
      email: formValue(data, "email"),
      type: formValue(data, "type"),
      company: formValue(data, "company"),
      message: formValue(data, "message"),
    };

    /*
     * This endpoint is always called first, even when the current
     * page says verification is disabled. The server remains the
     * authority if Admin settings changed after the page loaded.
     */
    await requestVerificationCode(payload);
  }

  async function verifyAndSend() {
    if (!pendingPayload) {
      return;
    }

    if (verificationToken) {
      await sendMessage(pendingPayload, {
        verificationToken,
      });
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setVerificationError("Enter the 6-digit code from your email.");
      return;
    }

    setStatus("verifying");
    setVerificationError("");

    try {
      const response = await fetch("/api/contact/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId,
          email: verificationEmail,
          code: verificationCode,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.verificationToken) {
        setVerificationError(
          data?.error ||
            "That verification code couldn't be confirmed.",
        );
        setStatus("idle");
        return;
      }

      const token = String(data.verificationToken);
      setVerificationToken(token);

      await sendMessage(pendingPayload, {
        verificationToken: token,
      });
    } catch {
      setVerificationError(
        "Couldn't verify the code. Check your connection and try again.",
      );
      setStatus("idle");
    }
  }

  async function resendCode() {
    if (!pendingPayload || resendSeconds > 0) {
      return;
    }

    await requestVerificationCode(pendingPayload);
  }

  function closeVerification() {
    if (status === "verifying" || status === "sending") {
      return;
    }

    resetVerification();
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="border-t border-black/30 py-8 dark:border-white/30">
        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
          MESSAGE RECEIVED ✓
        </p>

        <h3 className="mt-4 font-[var(--font-display)] text-4xl tracking-[-0.05em]">
          Thanks for reaching out.
        </h3>

        <p className="mt-3 text-[13px] leading-7 text-black/50 dark:text-white/50">
          Reference{" "}
          <span className="font-[var(--font-mono)] text-black dark:text-white">
            {reference}
          </span>
          .{" "}
          {sentWasVerified
            ? "I'll reply using the verified email you provided."
            : "Your message was received. The email address was not verified."}
        </p>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setReference("");
            setErrorMessage("");
            setSentWasVerified(true);
          }}
          className="mt-5 cursor-pointer border-0 bg-transparent p-0 text-[11px] font-bold transition-opacity hover:opacity-55"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        ref={formRef}
        className="border-t border-black/30 dark:border-white/30"
        onSubmit={submit}
      >
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-10000px] size-px"
        />

        <div className="grid md:grid-cols-2">
          <label
            className={`${labelClass} md:border-r md:border-black/10 md:pr-6 dark:md:border-white/10`}
          >
            <span className={labelTextClass}>Name</span>
            <input
              className={inputClass}
              name="name"
              minLength={2}
              maxLength={80}
              required
              placeholder="Your name"
            />
          </label>

          <label className={`${labelClass} md:pl-6`}>
            <span className={labelTextClass}>Email</span>
            <input
              className={inputClass}
              name="email"
              type="email"
              maxLength={160}
              required
              placeholder="you@company.com"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2">
          <label
            className={`${labelClass} md:border-r md:border-black/10 md:pr-6 dark:md:border-white/10`}
          >
            <span className={labelTextClass}>
              What would you like to discuss?
            </span>

            <select
              className={`${inputClass} cursor-pointer`}
              name="type"
              required
              defaultValue="job"
            >
              <option value="job">Job opportunity</option>
              <option value="project">Project / freelance</option>
              <option value="collaboration">Collaboration</option>
              <option value="technical">Technical discussion</option>
              <option value="other">Something else</option>
            </select>
          </label>

          <label className={`${labelClass} md:pl-6`}>
            <span className={labelTextClass}>
              Company{" "}
              <small className="normal-case tracking-normal opacity-65">
                optional
              </small>
            </span>

            <input
              className={inputClass}
              name="company"
              maxLength={120}
              placeholder="Company / team"
            />
          </label>
        </div>

        <label className={labelClass}>
          <span className={labelTextClass}>Message</span>

          <textarea
            className={`${inputClass} min-h-[180px] resize-y leading-7`}
            name="message"
            minLength={20}
            maxLength={3000}
            required
            rows={6}
            placeholder="Tell me a little about the role, project or idea."
          />
        </label>

        <div
          className={`
            flex
            flex-col
            gap-4
            pt-5

            sm:flex-row
            sm:items-center

            ${
              requireVerification
                ? "sm:justify-between"
                : "sm:justify-end"
            }
          `}
        >
          {requireVerification ? (
            <p className="m-0 text-[10px] text-black/45 dark:text-white/45">
              You&apos;ll be asked to verify your email before the message is sent.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              status === "sending-code" ||
              status === "sending"
            }
            className="
              inline-flex
              min-h-11
              cursor-pointer
              items-center
              justify-center
              border
              border-black
              bg-black
              px-5
              text-[12px]
              font-bold
              text-[#eef0f1]
              transition
              duration-200
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-white
              dark:bg-white
              dark:text-black
            "
          >
            {status === "sending-code"
              ? requireVerification
                ? "Sending code…"
                : "Sending…"
              : status === "sending"
                ? "Sending…"
                : "Send message"}
          </button>
        </div>

        <div role="status" aria-live="polite">
          {status === "error" ? (
            <p className="mt-4 text-[11px] text-[#f05a3d]">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </form>

      {verificationOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/35 px-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeVerification();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-verification-title"
            className="w-full max-w-[430px] border border-black/10 bg-[#eef0f1] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-[#171b21] sm:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                  Email verification
                </p>

                <h3
                  id="contact-verification-title"
                  className="mt-3 font-[var(--font-display)] text-[30px] tracking-[-0.045em]"
                >
                  Check your inbox.
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close email verification"
                onClick={closeVerification}
                disabled={status === "verifying" || status === "sending"}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-black/10 text-lg text-black/55 transition hover:border-black/25 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/55 dark:hover:border-white/25 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-[13px] leading-6 text-black/55 dark:text-white/55">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-black dark:text-white">
                {maskEmail(verificationEmail)}
              </span>
              . Enter it below to verify your email and send the message.
            </p>

            <label className="mt-7 block border-b border-black/20 pb-3 focus-within:border-black/60 dark:border-white/20 dark:focus-within:border-white/60">
              <span className="mb-3 block font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-black/45 dark:text-white/45">
                Verification code
              </span>

              <input
                autoFocus
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  );
                  setVerificationError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void verifyAndSend();
                  }
                }}
                className="w-full border-0 bg-transparent py-1 text-center font-[var(--font-mono)] text-[30px] tracking-[0.32em] text-black outline-none ring-0 placeholder:text-black/20 focus:outline-none dark:text-white dark:placeholder:text-white/20"
                placeholder="000000"
                aria-label="6-digit email verification code"
              />
            </label>

            {verificationError ? (
              <p className="mt-3 text-[11px] leading-5 text-[#f05a3d]">
                {verificationError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void verifyAndSend()}
              disabled={status === "verifying" || status === "sending"}
              className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center bg-black px-5 text-[12px] font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {status === "verifying"
                ? "Verifying…"
                : status === "sending"
                  ? "Sending message…"
                  : verificationToken
                    ? "Try sending again"
                    : "Verify & send message"}
            </button>

            <div className="mt-5 flex items-center justify-between gap-4 text-[10px] text-black/45 dark:text-white/45">
              <span>Code expires in 10 minutes.</span>

              <button
                type="button"
                disabled={
                  resendSeconds > 0 ||
                  status === "sending-code"
                }
                onClick={() => void resendCode()}
                className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-black transition-opacity hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-35 dark:text-white"
              >
                {resendSeconds > 0
                  ? `Resend in ${resendSeconds}s`
                  : "Resend code"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
