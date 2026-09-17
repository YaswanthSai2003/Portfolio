"use client";

import dynamic from "next/dynamic";

const ResumePdf = dynamic(
  () =>
    import(
      "@/components/resume-pdf"
    ).then(
      (module) =>
        module.ResumePdf,
    ),
  {
    ssr: false,

    loading: () => (
      <div
        className="
          flex
          min-h-[500px]
          w-full
          items-center
          justify-center

          text-[11px]
          text-black/40

          dark:text-white/40
        "
      >
        Loading resume...
      </div>
    ),
  },
);

export function ResumeViewer() {
  return <ResumePdf />;
}