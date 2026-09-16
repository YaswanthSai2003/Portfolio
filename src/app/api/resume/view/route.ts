import { NextResponse } from "next/server";

import { getSiteSettings } from "@/lib/content";
import {
  createSignedUrl,
  dbSelect,
  hasSupabase,
} from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ResumeRow = {
  storage_path: string;
  file_name: string;
};

function safeFilename(value: string) {
  return (
    value
      .replace(/[\r\n"]/g, "")
      .trim() || "resume.pdf"
  );
}

async function getActiveResume() {
  const rows = await dbSelect<ResumeRow>(
    "resume_versions",
    [
      "select=storage_path,file_name",
      "is_active=eq.true",
      "limit=1",
    ].join("&"),
  );

  return rows[0];
}

export async function GET() {
  /*
   * Preferred source:
   * active resume stored in the private
   * Supabase `resumes` bucket.
   */
  if (hasSupabase()) {
    try {
      const active = await getActiveResume();

      if (active) {
        const signedUrl =
          await createSignedUrl(
            "resumes",
            active.storage_path,
            300,
          );

        const storageResponse =
          await fetch(signedUrl, {
            cache: "no-store",
          });

        if (!storageResponse.ok) {
          console.error(
            "Resume storage request failed:",
            storageResponse.status,
            storageResponse.statusText,
          );
        } else {
          const pdf =
            await storageResponse.arrayBuffer();

          return new Response(pdf, {
            status: 200,

            headers: {
              "Content-Type":
                "application/pdf",

              /*
               * THIS is the important part.
               *
               * `inline` tells Chrome/Safari/etc.
               * that the PDF may be rendered inside
               * the browser / iframe.
               */
              "Content-Disposition":
                `inline; filename="${safeFilename(
                  active.file_name,
                )}"`,

              "Content-Length":
                String(pdf.byteLength),

              "Cache-Control":
                "private, no-store, max-age=0",

              "X-Content-Type-Options":
                "nosniff",
            },
          });
        }
      }
    } catch (error) {
      console.error(
        "Unable to load active resume:",
        error,
      );
    }
  }

  /*
   * Optional external resume fallback from
   * site settings.
   */
  try {
    const settings =
      await getSiteSettings();

    if (settings.resumeUrl) {
      return NextResponse.redirect(
        settings.resumeUrl,
        302,
      );
    }
  } catch (error) {
    console.error(
      "Unable to load resume fallback:",
      error,
    );
  }

  return NextResponse.json(
    {
      error:
        "No active resume is configured.",
    },
    {
      status: 404,
    },
  );
}