import Link from "next/link";
import { AdminPageHeader, StatCard } from "@/components/admin/admin-ui";
import { getAllProjectsForAdmin } from "@/lib/content";
import { dbSelect, hasSupabase } from "@/lib/supabase-rest";

export default async function AdminOverviewPage() {
  const projects = await getAllProjectsForAdmin();
  const configured = hasSupabase();
  const messages = configured ? await dbSelect<{ id: string; status: string }>("contact_messages", "select=id,status&order=created_at.desc&limit=100").catch(() => []) : [];
  const resume = configured ? await dbSelect<{ id: string; is_active: boolean }>("resume_versions", "select=id,is_active&order=uploaded_at.desc&limit=100").catch(() => []) : [];
  const events = configured ? await dbSelect<{ session_id: string; event_type: string }>("analytics_events", "select=session_id,event_type&order=created_at.desc&limit=500").catch(() => []) : [];
  const uniqueVisitors = new Set(events.map((event) => event.session_id)).size;

  return (
    <>
      <AdminPageHeader eyebrow="ADMIN / OVERVIEW" title="Portfolio OS" description="The private control surface for your public portfolio: content, documents, messages and lightweight first-party analytics." action={<Link href="/" className="text-[10px] font-semibold text-white/50">View site</Link>} />

      {!configured ? (
        <div className="mt-7 border border-[#d95239]/35 bg-[#d95239]/5 p-5 text-[11px] leading-6 text-white/50">
          <strong className="text-white/80">Database not connected.</strong> The public site is using its built-in fallback content. Run <code>supabase/schema.sql</code> in Supabase and add the environment variables from <code>.env.example</code> to enable CMS writes, inbox, resume storage and analytics.
        </div>
      ) : null}

      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published projects" value={projects.filter((project) => project.status !== "draft" && project.status !== "archived").length} detail={`${projects.length} total`} />
        <StatCard label="Unread messages" value={messages.filter((message) => message.status === "new").length} detail={`${messages.length} recent`} />
        <StatCard label="Active resume" value={resume.some((item) => item.is_active) ? "Ready" : "—"} detail={`${resume.length} versions`} />
        <StatCard label="Recent visitors" value={uniqueVisitors || "—"} detail="Last 500 events" />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Projects", "Publish what matters", "Create, edit, reorder and archive case studies without changing frontend code.", "/admin/projects"],
          ["Resume", "One public resume", "Upload versions, keep history and switch the active PDF without redeploying.", "/admin/resume"],
          ["Inbox", "Portfolio enquiries", "Messages submitted from the public contact form, with simple workflow states.", "/admin/inbox"],
          ["Analytics", "Useful, private signals", "Anonymous sessions, sources, devices and meaningful portfolio interactions.", "/admin/analytics"],
        ].map(([eyebrow, title, copy, href]) => (
          <Link key={href} href={href} className="group min-h-56 border border-white/8 bg-white/[0.012] p-6 transition hover:border-white/18 hover:bg-white/[0.025]">
            <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.11em] text-white/28">{eyebrow}</p>
            <h2 className="mt-10 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.045em]">{title}</h2>
            <p className="mt-3 text-[10px] leading-5 text-white/38">{copy}</p>
            <span className="mt-7 inline-block text-[10px] font-semibold text-white/50 transition group-hover:text-white">Open</span>
          </Link>
        ))}
      </section>
    </>
  );
}
