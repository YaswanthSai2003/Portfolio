import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(
  request: NextRequest,
) {
  const target =
    new URL(
      "/api/resume/current",
      request.url,
    );

  target.searchParams.set(
    "download",
    "1",
  );

  return NextResponse.redirect(
    target,
    307,
  );
}