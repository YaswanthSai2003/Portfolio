"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function ResumeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(780);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateWidth = () => {
      const availableWidth = container.clientWidth;

      setPageWidth(
        Math.min(
          Math.max(availableWidth - 32, 280),
          820,
        ),
      );
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        flex
        w-full
        flex-col
        items-center
        gap-8
      "
    >
      <Document
        file="/api/resume/view"
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
        }}
        loading={
          <div className="py-32 text-[11px] text-black/40 dark:text-white/40">
            Loading resume...
          </div>
        }
        error={
          <div className="py-32 text-[11px] text-red-600">
            Unable to load resume.
          </div>
        }
      >
        {Array.from(
          { length: numPages },
          (_, index) => (
            <div
              key={index}
              className="
                mb-8
                overflow-hidden
                bg-white
                shadow-[0_20px_60px_rgba(20,20,20,.09)]
              "
            >
              <Page
                pageNumber={index + 1}
                width={pageWidth}
                renderAnnotationLayer={true}
                renderTextLayer={true}
              />
            </div>
          ),
        )}
      </Document>
    </div>
  );
}