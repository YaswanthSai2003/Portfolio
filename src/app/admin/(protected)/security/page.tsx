import { AdminPageHeader } from "@/components/admin/admin-ui";
import { adminAuthConfigured } from "@/lib/admin-auth";
import { hasSupabase } from "@/lib/supabase-rest";

export default function AdminSecurityPage() {
  const checks = [
    ["Admin authentication", adminAuthConfigured(), "Signed HTTP-only session cookie with a server-only secret."],
    ["Persistent database", hasSupabase(), "Supabase PostgreSQL for CMS, inbox, analytics and audit history."],
    ["Private resume storage", hasSupabase(), "PDFs are stored in a private bucket and exposed with short-lived signed URLs."],
    ["Mail delivery", Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL), "Optional Resend delivery; database inbox remains independent."],
    ["Analytics hash secret", Boolean(process.env.ANALYTICS_HASH_SECRET || process.env.ADMIN_SESSION_SECRET), "Raw IP addresses are never persisted; only a one-way hash is stored."],
  ] as const;

  return (
    <>
      <AdminPageHeader eyebrow="SECURITY" title="Security posture" description="A small portfolio does not need enterprise RBAC, but it still needs clear trust boundaries, server-only secrets and safe document/content handling." />
      <div className="mt-8 border-t border-white/14">
        {checks.map(([label, ok, copy]) => (
          <div key={label} className="grid gap-4 border-b border-white/8 py-5 sm:grid-cols-[1fr_110px_1.5fr] sm:items-center">
            <strong className="text-[11px]">{label}</strong>
            <span className={`w-fit rounded-full border px-2 py-1 font-[var(--font-mono)] text-[7px] uppercase tracking-[0.08em] ${ok ? "border-emerald-400/30 text-emerald-300/70" : "border-amber-400/30 text-amber-300/70"}`}>{ok ? "Configured" : "Needs setup"}</span>
            <span className="text-[9px] leading-5 text-white/35">{copy}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Server-only secrets", "Service-role, Resend and admin secrets never use NEXT_PUBLIC_* variables."],
          ["Minimal tracking", "Anonymous sessions and device class only; no invasive fingerprinting or raw IP retention."],
          ["Private documents", "Old resume versions remain private; only the active version is accessible through a controlled route."],
        ].map(([title, copy]) => <div key={title} className="border border-white/8 p-5"><h2 className="text-[11px] font-semibold">{title}</h2><p className="mt-3 text-[9px] leading-5 text-white/35">{copy}</p></div>)}
      </div>
    </>
  );
}
