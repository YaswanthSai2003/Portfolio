import Link from "next/link";

import { ResumeViewer } from "@/components/resume-viewer";

const shell =
  "mx-auto w-[min(1420px,calc(100%_-_64px))] max-sm:w-[calc(100%_-_32px)]";

export default function ResumePage() {
  return (
    <section
      className="
        min-h-screen
        bg-[#eef1f2]
        dark:bg-[#111416]
      "
    >
      <div className={`${shell} py-8 lg:py-10`}>
        {/* controls */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            border-b
            border-black/10
            pb-6
            dark:border-white/10
          "
        >
          <Link
            href="/"
            className="
              text-[10px]
              font-medium
              text-black/50
              transition
              hover:text-black

              dark:text-white/50
              dark:hover:text-white
            "
          >
            ← Portfolio
          </Link>

          <a
            href="/api/resume/download"
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              rounded-full
              bg-black
              px-5
              text-[10px]
              font-semibold
              text-white
              transition
              hover:bg-black/80

              dark:bg-white
              dark:text-black
              dark:hover:bg-white/85
            "
          >
            Download resume ↓
          </a>
        </div>

        {/* PDF */}
        <div className="py-10 lg:py-14">
          <ResumeViewer />
        </div>
      </div>
    </section>
  );
}