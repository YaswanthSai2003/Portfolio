"use client";

import Link from "next/link";
import { useState } from "react";

import type { SiteSettings } from "@/data/site";

import {
  GitHubIcon,
  LinkedInIcon,
} from "./icons";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Projects", "/#work"],
  ["Experience", "/#experience"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
] as const;

export function SiteHeader({
  settings,
}: {
  settings: SiteSettings;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#eef0f1]/92 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#12151a]/92">
      <div className="mx-auto flex h-[72px] w-full max-w-[1420px] items-center justify-between px-5 sm:px-7 lg:px-8">
        <Link
          href="/"
          onClick={() =>
            setOpen(false)
          }
          aria-label={`${settings.fullName} home`}
          className="group inline-flex items-baseline gap-1 font-[var(--font-display)] text-[18px] font-bold tracking-[-0.045em]"
        >
          {settings.brandName}
          <span className="text-[#f05a3d] transition-transform group-hover:translate-x-0.5">
            .
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Primary navigation"
        >
          {links.map(
            ([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] font-medium text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
              >
                {label}
              </Link>
            ),
          )}

          <Link
            href="/resume"
            className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold transition hover:border-black/25 dark:border-white/12 dark:hover:border-white/25"
          >
            Resume
          </Link>

          {(settings.githubUrl ||
            settings.linkedinUrl) ? (
            <span className="h-4 w-px bg-black/8 dark:bg-white/8" />
          ) : null}

          {settings.githubUrl ? (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              <GitHubIcon className="size-[17px]" />
            </a>
          ) : null}

          {settings.linkedinUrl ? (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              <LinkedInIcon className="size-[17px]" />
            </a>
          ) : null}

          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            aria-expanded={open}
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            onClick={() =>
              setOpen(
                (value) => !value,
              )
            }
            className="inline-flex h-9 items-center rounded-full border border-black/10 px-3 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-black/56 dark:border-white/12 dark:text-white/56"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-x-0 top-[72px] min-h-[calc(100svh-72px)] border-t border-black/[0.06] bg-[#eef0f1] dark:border-white/[0.07] dark:bg-[#12151a] lg:hidden">
          <nav
            className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1420px] flex-col justify-between px-5 py-8 sm:px-7"
            aria-label="Mobile navigation"
          >
            <div>
              {links.map(
                (
                  [label, href],
                  index,
                ) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() =>
                      setOpen(false)
                    }
                    className="group flex items-center justify-between border-b border-black/8 py-5 dark:border-white/8"
                  >
                    <span className="font-[var(--font-display)] text-[clamp(34px,10vw,54px)] font-semibold tracking-[-0.055em]">
                      {label}
                    </span>
                    <span className="font-[var(--font-mono)] text-[9px] text-black/30 dark:text-white/30">
                      0{index + 1}
                    </span>
                  </Link>
                ),
              )}

              <Link
                href="/resume"
                onClick={() =>
                  setOpen(false)
                }
                className="group flex items-center justify-between border-b border-black/8 py-5 dark:border-white/8"
              >
                <span className="font-[var(--font-display)] text-[clamp(34px,10vw,54px)] font-semibold tracking-[-0.055em]">
                  Resume
                </span>
                <span className="font-[var(--font-mono)] text-[9px] text-black/30 dark:text-white/30">
                  05
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-between gap-6 pt-8">
              <span className="max-w-[220px] font-[var(--font-mono)] text-[9px] uppercase leading-5 tracking-[0.1em] text-black/35 dark:text-white/35">
                {settings.role}
              </span>

              {(settings.githubUrl ||
                settings.linkedinUrl) ? (
                <div className="flex items-center gap-4">
                  {settings.githubUrl ? (
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                    >
                      <GitHubIcon className="size-[18px]" />
                    </a>
                  ) : null}

                  {settings.linkedinUrl ? (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon className="size-[18px]" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
