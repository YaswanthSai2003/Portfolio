import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";
import { writeAudit } from "@/lib/audit";

export async function POST(request: Request) {
  await clearAdminCookie();
  await writeAudit("LOGOUT", "admin");
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
