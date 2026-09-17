import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSignedUrl,
  dbSelect,
  hasSupabase,
} from "@/lib/supabase-rest";

type ResumeRow = {
  storage_path: string;
  file_name: string;
};

export async function GET(
  request: NextRequest,
) {
  const download =
    request.nextUrl.searchParams.get(
      "download",
    ) === "1";

  if (!hasSupabase()) {
    return NextResponse.json(
      {
        error:
          "Resume storage is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const rows =
      await dbSelect<ResumeRow>(
        "resume_versions",
        "select=storage_path,file_name&is_active=eq.true&limit=1",
      );

    const active = rows[0];

    if (!active) {
      return NextResponse.json(
        {
          error:
            "No active resume is configured.",
        },
        { status: 404 },
      );
    }

    const signed =
      await createSignedUrl(
        "resumes",
        active.storage_path,
        300,
      );

    if (!download) {
      return NextResponse.redirect(
        signed,
        302,
      );
    }

    const response =
      await fetch(signed);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Could not load the active resume.",
        },
        { status: 502 },
      );
    }

    return new NextResponse(
      await response.arrayBuffer(),
      {
        headers: {
          "Content-Type":
            "application/pdf",
          "Content-Disposition": `attachment; filename="${active.file_name.replaceAll(
            '"',
            "",
          )}"`,
          "Cache-Control":
            "private, no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not load the active resume.",
      },
      { status: 500 },
    );
  }
}
