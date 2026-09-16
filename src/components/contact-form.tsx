"use client";

import {
  useState,
  type FormEvent,
} from "react";

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
  transition-colors

  dark:text-white/45
`;

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [reference, setReference] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setStatus("sending");
    setErrorMessage("");

    const form =
      event.currentTarget;

    const payload =
      Object.fromEntries(
        new FormData(
          form,
        ).entries(),
      );

    try {
      const response =
        await fetch(
          "/api/contact",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload,
            ),
          },
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(
          data?.error ||
            "Couldn't send the message. Please try again.",
        );

        setStatus("error");
        return;
      }

      setReference(
        data.reference ||
          "MSG-RECEIVED",
      );

      setStatus("sent");

      try {
        navigator.sendBeacon(
          "/api/analytics",

          new Blob(
            [
              JSON.stringify({
                eventType:
                  "contact_submit",

                path:
                  window.location
                    .pathname,
              }),
            ],

            {
              type: "application/json",
            },
          ),
        );
      } catch {
        // Analytics is optional.
      }

      form.reset();
    } catch {
      setErrorMessage(
        "Couldn't reach the server. Check your connection and try again.",
      );

      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="
          border-t
          border-black/30
          py-8

          dark:border-white/30
        "
      >
        <p
          className="
            font-[var(--font-mono)]
            text-[10px]
            uppercase
            tracking-[0.14em]

            text-black/45

            dark:text-white/45
          "
        >
          MESSAGE RECEIVED ✓
        </p>

        <h3
          className="
            mt-4

            font-[var(--font-display)]
            text-4xl
            tracking-[-0.05em]
          "
        >
          Thanks for reaching out.
        </h3>

        <p
          className="
            mt-3

            text-[13px]
            leading-7
            text-black/50

            dark:text-white/50
          "
        >
          Reference{" "}
          <span
            className="
              font-[var(--font-mono)]
              text-black

              dark:text-white
            "
          >
            {reference}
          </span>
          . I&apos;ll reply using
          the email you provided.
        </p>

        <button
          type="button"
          onClick={() =>
            setStatus("idle")
          }
          className="
            mt-5
            cursor-pointer

            border-0
            bg-transparent
            p-0

            text-[11px]
            font-bold

            transition-opacity
            hover:opacity-55
          "
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="
        border-t
        border-black/30

        dark:border-white/30
      "
      onSubmit={submit}
    >
      {/* Honeypot */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="
          absolute
          left-[-10000px]
          size-px
        "
      />

      {/* Name / Email */}
      <div className="grid md:grid-cols-2">
        <label
          className={`
            ${labelClass}

            md:border-r
            md:border-black/10
            md:pr-6

            dark:md:border-white/10
          `}
        >
          <span
            className={
              labelTextClass
            }
          >
            Name
          </span>

          <input
            className={
              inputClass
            }
            name="name"
            minLength={2}
            maxLength={80}
            required
            placeholder="Your name"
          />
        </label>

        <label
          className={`
            ${labelClass}
            md:pl-6
          `}
        >
          <span
            className={
              labelTextClass
            }
          >
            Email
          </span>

          <input
            className={
              inputClass
            }
            name="email"
            type="email"
            maxLength={160}
            required
            placeholder="you@company.com"
          />
        </label>
      </div>

      {/* Discussion / Company */}
      <div className="grid md:grid-cols-2">
        <label
          className={`
            ${labelClass}

            md:border-r
            md:border-black/10
            md:pr-6

            dark:md:border-white/10
          `}
        >
          <span
            className={
              labelTextClass
            }
          >
            What would you like
            to discuss?
          </span>

          <select
            className={`
              ${inputClass}
              cursor-pointer
            `}
            name="type"
            required
            defaultValue="job"
          >
            <option value="job">
              Job opportunity
            </option>

            <option value="project">
              Project / freelance
            </option>

            <option value="collaboration">
              Collaboration
            </option>

            <option value="technical">
              Technical discussion
            </option>

            <option value="other">
              Something else
            </option>
          </select>
        </label>

        <label
          className={`
            ${labelClass}
            md:pl-6
          `}
        >
          <span
            className={
              labelTextClass
            }
          >
            Company{" "}
            <small
              className="
                normal-case
                tracking-normal
                opacity-65
              "
            >
              optional
            </small>
          </span>

          <input
            className={
              inputClass
            }
            name="company"
            maxLength={120}
            placeholder="Company / team"
          />
        </label>
      </div>

      {/* Message */}
      <label
        className={`
          ${labelClass}
          block
        `}
      >
        <span
          className={
            labelTextClass
          }
        >
          Message
        </span>

        <textarea
          className={`
            ${inputClass}

            min-h-[180px]
            resize-y
            leading-7
          `}
          name="message"
          minLength={20}
          maxLength={3000}
          required
          rows={6}
          placeholder="Tell me a little about the role, project or idea."
        />
      </label>

      {/* Footer */}
      <div
        className="
          flex
          flex-col
          gap-4
          pt-5

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p
          className="
            m-0

            text-[10px]
            text-black/45

            dark:text-white/45
          "
        >
          I&apos;ll use your
          email only to reply to
          this message.
        </p>

        <button
          type="submit"
          disabled={
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
          {status === "sending"
            ? "Sending…"
            : "Send message"}
        </button>
      </div>

      <div
        role="status"
        aria-live="polite"
      >
        {status === "error" ? (
          <p
            className="
              mt-4
              text-[11px]
              text-[#f05a3d]
            "
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}