import Link from "next/link";
import type { SiteSettings } from "@/data/site";
import { ContactForm } from "./contact-form";
import { SocialLinks } from "./social-links";

const shell =
  "mx-auto w-[min(1420px,calc(100%_-_64px))] max-sm:w-[calc(100%_-_32px)]";

const kicker =
  "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-black/42 dark:text-white/42";

function DirectContact({ settings }: { settings: SiteSettings }) {
  const hasEmail = Boolean(settings.email.trim());
  const hasLinkedIn = Boolean(settings.linkedinUrl.trim());

  return (
    <div className="border-t border-black/30 py-8 dark:border-white/30">
      <p className={kicker}>DIRECT CONTACT</p>

      <h3 className="mt-4 max-w-[620px] font-[var(--font-display)] text-[clamp(34px,3.6vw,56px)] font-semibold leading-[0.95] tracking-[-0.055em]">
        Prefer reaching out directly?
      </h3>

      <p className="mt-5 max-w-[560px] text-[13px] leading-7 text-black/50 dark:text-white/50">
        Choose the channel that works best for you.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {hasEmail ? (
          <a
            href={`mailto:${settings.email}`}
            className="group flex min-h-28 flex-col justify-between border border-black/10 p-5 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-black/38 dark:text-white/38">
              Email
            </span>
            <span className="text-[13px] font-bold">
              Email me{" "}
              <span className="transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </a>
        ) : null}

        {hasLinkedIn ? (
          <a
            href={settings.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-28 flex-col justify-between border border-black/10 p-5 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-black/38 dark:text-white/38">
              LinkedIn
            </span>
            <span className="text-[13px] font-bold">
              Connect on LinkedIn{" "}
              <span className="transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </a>
        ) : null}
      </div>

      {!hasEmail && !hasLinkedIn ? (
        <p className="mt-6 text-[12px] leading-6 text-black/45 dark:text-white/45">
          Direct contact details are temporarily unavailable. You can still view my work and resume.
        </p>
      ) : null}
    </div>
  );
}

function ClosedContact() {
  return (
    <div className="border-t border-black/30 py-8 dark:border-white/30">
      <div className="flex items-center gap-3">
        <span className="size-2 rounded-full bg-[#f05a3d] shadow-[0_0_0_4px_rgba(240,90,61,0.10)]" />
        <p className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[#f05a3d]">
          CONTACT STATUS
        </p>
      </div>

      <h3 className="mt-5 max-w-[650px] font-[var(--font-display)] text-[clamp(34px,3.6vw,56px)] font-semibold leading-[0.95] tracking-[-0.055em]">
        Not accepting new enquiries right now.
      </h3>

      <p className="mt-5 max-w-[560px] text-[13px] leading-7 text-black/50 dark:text-white/50">
        Contact submissions are temporarily closed. The rest of the portfolio remains available.
      </p>
    </div>
  );
}

export function ContactSection({ settings }: { settings: SiteSettings }) {
  const mode =
    settings.contactMode === "direct" ||
    settings.contactMode === "closed"
      ? settings.contactMode
      : "form";

  const note =
    mode === "direct"
      ? settings.contactDirectNote
      : mode === "closed"
        ? settings.contactClosedNote
        : settings.contactFormNote;

  return (
    <section
      id="contact"
      className={`${shell} grid scroll-mt-24 gap-14 py-28 lg:grid-cols-[.72fr_1.28fr] lg:gap-20 lg:py-32`}
    >
      <div>
        <p className={kicker}>05 / CONTACT</p>

        <h2 className="mt-4 whitespace-pre-line font-[var(--font-display)] text-[clamp(52px,5.4vw,86px)] font-semibold leading-[0.9] tracking-[-0.064em]">
          {settings.contactHeadline}
        </h2>

        <p className="mt-7 max-w-[430px] text-[13px] leading-7 text-black/50 dark:text-white/50">
          {note}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link
            href="/resume"
            className="text-[12px] font-bold text-black/55 dark:text-white/55"
          >
            View resume
          </Link>

          <SocialLinks
            githubUrl={settings.githubUrl}
            linkedinUrl={settings.linkedinUrl}
          />
        </div>
      </div>

      {mode === "form" ? (
        <ContactForm
          requireVerification={settings.contactRequireVerification}
        />
      ) : mode === "direct" ? (
        <DirectContact settings={settings} />
      ) : (
        <ClosedContact />
      )}
    </section>
  );
}
