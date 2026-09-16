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
  const cleaned =
    value
      .replace(/[\r\n"]/g, "")
      .trim();

  if (!cleaned) {
    return "Yaswanth-Sai-Reddy-Resume.pdf";
  }

  return cleaned
    .toLowerCase()
    .endsWith(".pdf")
    ? cleaned
    : `${cleaned}.pdf`;
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
   * Download active Supabase resume.
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
               * Unlike /view,
               * attachment forces download.
               */
              "Content-Disposition":
                `attachment; filename="${safeFilename(
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
        "Unable to download active resume:",
        error,
      );
    }
  }

  /*
   * External fallback.
   *
   * Instead of simply opening the external
   * URL, try downloading it through our route.
   */
  try {
    const settings =
      await getSiteSettings();

    if (settings.resumeUrl) {
      const external =
        await fetch(settings.resumeUrl, {
          cache: "no-store",
        });

      if (external.ok) {
        const pdf =
          await external.arrayBuffer();

        return new Response(pdf, {
          status: 200,

          headers: {
            "Content-Type":
              external.headers.get(
                "content-type",
              ) || "application/pdf",

            "Content-Disposition":
              'attachment; filename="Yaswanth-Sai-Reddy-Resume.pdf"',

            "Content-Length":
              String(pdf.byteLength),

            "Cache-Control":
              "private, no-store, max-age=0",

            "X-Content-Type-Options":
              "nosniff",
          },
        });
      }

      /*
       * Last fallback if the external
       * provider refuses server-side fetching.
       */
      return NextResponse.redirect(
        settings.resumeUrl,
        302,
      );
    }
  } catch (error) {
    console.error(
      "Unable to load external resume:",
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