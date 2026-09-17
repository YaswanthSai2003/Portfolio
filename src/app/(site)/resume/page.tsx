import Link from "next/link";

import { TrackedLink } from "@/components/tracked-link";
import {
  dbSelect,
  hasSupabase,
} from "@/lib/supabase-rest";

const shell =
  "mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-8";

const kicker =
  "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-black/38 dark:text-white/38";

type ActiveResume = {
  label: string;
  uploaded_at: string;
};

export default async function ResumePage() {
  const active = hasSupabase()
    ? (
        await dbSelect<ActiveResume>(
          "resume_versions",
          "select=label,uploaded_at&is_active=eq.true&limit=1",
        ).catch(() => [])
      )[0]
    : undefined;

  const available = Boolean(active);

  return (
    <section
      className={`${shell} pb-24 pt-10 sm:pt-14`}
    >
      <Link
        href="/"
        className="text-[11px] font-semibold text-black/45 transition hover:text-black dark:text-white/45 dark:hover:text-white"
      >
        ← Portfolio
      </Link>

      <div className="grid min-h-[calc(100svh-180px)] items-center gap-14 py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div>
          <p className={kicker}>
            RESUME
          </p>

          <h1 className="mt-5 font-[var(--font-display)] text-[clamp(54px,6.4vw,88px)] font-semibold leading-[0.92] tracking-[-0.065em]">
            Resume
          </h1>

          <p className="mt-6 max-w-xl text-[14px] leading-8 text-black/50 dark:text-white/50">
            Experience, selected projects, technical skills, education and certifications in one current PDF.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {available ? (
              <>
                <TrackedLink
                  href="/api/resume/current"
                  eventType="resume_view"
                  className="inline-flex min-h-11 items-center rounded-full bg-[#151515] px-5 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
                >
                  View PDF ↗
                </TrackedLink>

                <TrackedLink
                  href="/api/resume/current?download=1"
                  eventType="resume_download"
                  className="inline-flex min-h-11 items-center rounded-full border border-black/10 px-5 text-[11px] font-semibold transition hover:border-black/25 dark:border-white/12 dark:hover:border-white/25"
                >
                  Download ↓
                </TrackedLink>
              </>
            ) : (
              <Link
                href="/#contact"
                className="inline-flex min-h-11 items-center rounded-full bg-[#151515] px-5 text-[11px] font-semibold text-white dark:bg-white dark:text-black"
              >
                Contact me
              </Link>
            )}
          </div>

          {active ? (
            <p className="mt-4 font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-black/28 dark:text-white/28">
              Current version · {active.label}
            </p>
          ) : null}
        </div>

        <aside className="rounded-[26px] border border-black/8 bg-[#e6e9eb] p-6 dark:border-white/8 dark:bg-[#1d2229] sm:p-7">
          <p className={kicker}>
            CONTENTS
          </p>

          <div className="mt-5 divide-y divide-black/8 dark:divide-white/8">
            {[
              "Professional experience",
              "Selected engineering projects",
              "Backend / full-stack / AI skills",
              "Education and certifications",
            ].map(
              (item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[36px_1fr] py-4"
                >
                  <span className="font-[var(--font-mono)] text-[8px] text-[#db8f4b]">
                    0{index + 1}
                  </span>

                  <span className="text-[11px] font-semibold">
                    {item}
                  </span>
                </div>
              ),
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
