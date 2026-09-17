import { NextResponse } from "next/server";

import {
  createSignedUrl,
  dbSelect,
  hasSupabase,
} from "@/lib/supabase-rest";

export const dynamic =
  "force-dynamic";

export const runtime =
  "nodejs";

type ResumeRow = {
  storage_path: string;
  file_name: string;
};

function safeFilename(
  value: string,
) {
  const cleaned =
    value
      .replace(
        /[\r\n"]/g,
        "",
      )
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
  const rows =
    await dbSelect<ResumeRow>(
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
  if (!hasSupabase()) {
    return NextResponse.json(
      {
        error:
          "Resume storage is not configured.",
      },
      {
        status: 503,
      },
    );
  }

  try {
    const active =
      await getActiveResume();

    if (!active) {
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

    const signedUrl =
      await createSignedUrl(
        "resumes",
        active.storage_path,
        300,
      );

    const storageResponse =
      await fetch(
        signedUrl,
        {
          cache:
            "no-store",
        },
      );

    if (
      !storageResponse.ok
    ) {
      console.error(
        "Resume storage request failed:",
        storageResponse.status,
        storageResponse.statusText,
      );

      return NextResponse.json(
        {
          error:
            "Unable to download resume.",
        },
        {
          status: 502,
        },
      );
    }

    const pdf =
      await storageResponse.arrayBuffer();

    return new Response(
      pdf,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${safeFilename(
              active.file_name,
            )}"`,

          "Content-Length":
            String(
              pdf.byteLength,
            ),

          "Cache-Control":
            "private, no-store, max-age=0",

          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (error) {
    console.error(
      "Unable to download active resume:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to download resume.",
      },
      {
        status: 500,
      },
    );
  }
}