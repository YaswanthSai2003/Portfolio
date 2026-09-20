"use client";

import dynamic from "next/dynamic";

const ResumePdf = dynamic(
  () =>
    import("@/components/resume-pdf").then(
      (module) => module.ResumePdf,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full justify-center py-6">
        <div className="w-full max-w-[794px] animate-pulse rounded-sm bg-white px-10 py-12 shadow-sm dark:bg-neutral-950">
          <div className="mb-8 space-y-3">
            <div className="h-6 w-48 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-3 w-64 rounded bg-black/10 dark:bg-white/10" />
          </div>

          <div className="space-y-7">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-4 w-32 rounded bg-black/10 dark:bg-white/10" />

                <div className="h-3 w-full rounded bg-black/5 dark:bg-white/5" />
                <div className="h-3 w-[92%] rounded bg-black/5 dark:bg-white/5" />
                <div className="h-3 w-[78%] rounded bg-black/5 dark:bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export function ResumeViewer() {
  return <ResumePdf />;
}