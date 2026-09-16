import Link from "next/link";

import type { SiteSettings } from "@/data/site";
import { SocialLinks } from "./social-links";

export function SiteFooter({
  settings,
}: {
  settings: SiteSettings;
}) {
  return (
    <footer
      className="
        border-t
        border-black/10

        bg-[#eef0f1]

        dark:border-white/[0.09]
        dark:bg-[#12151a]
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-80
          w-[min(1420px,calc(100%_-_64px))]
          grid-cols-[1.3fr_.7fr]
          items-center
          gap-16

          max-sm:w-[calc(100%_-_32px)]

          max-md:grid-cols-1
          max-md:py-16
        "
      >
        <div>
          <p
            className="
              m-0

              font-[var(--font-mono)]
              text-[10px]
              uppercase
              tracking-[0.14em]
              text-black/45

              dark:text-white/45
            "
          >
            LET&apos;S CONNECT
          </p>

          <h2
            className="
              mt-3

              font-[var(--font-display)]
              text-[clamp(52px,6vw,90px)]
              font-semibold
              tracking-[-0.065em]
            "
          >
            Let&apos;s build
            something useful.
          </h2>
        </div>

        <div
          className="
            grid
            justify-items-end
            gap-4
            text-xs

            max-md:justify-items-start
          "
        >
          <Link href="/#contact">
            Contact
          </Link>

          <Link href="/resume">
            Resume
          </Link>

          <SocialLinks
            githubUrl={
              settings.githubUrl
            }
            linkedinUrl={
              settings.linkedinUrl
            }
          />
        </div>
      </div>

      <div
        className="
          mx-auto
          flex
          min-h-[58px]
          w-[min(1420px,calc(100%_-_64px))]
          items-center
          justify-between

          border-t
          border-black/10

          font-[var(--font-mono)]
          text-[8px]
          tracking-[0.08em]
          text-black/45

          dark:border-white/[0.09]
          dark:text-white/45

          max-sm:w-[calc(100%_-_32px)]

          max-sm:flex-col
          max-sm:items-start
          max-sm:justify-center
          max-sm:gap-1
        "
      >
        <span>
          Designed &amp; engineered
          by {settings.fullName}
        </span>

        <span>
          FULL STACK · BACKEND · AI · ML
        </span>
      </div>
    </footer>
  );
}