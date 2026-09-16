import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { getAllProjectsForAdmin } from "@/lib/content";
import { hasSupabase } from "@/lib/supabase-rest";
import { deleteProjectAction, moveProjectAction } from "../actions";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();
  return (
    <>
      <AdminPageHeader eyebrow="CONTENT" title="Projects" description="The public project section is database-driven when Supabase is configured. Draft privately, preview, then publish." action={<Link href="/admin/projects/new" className="inline-flex min-h-10 items-center bg-[#eef0f1] px-4 text-[10px] font-bold text-[#111]">New project +</Link>} />
      {!hasSupabase() ? <p className="mt-6 border border-white/8 p-4 text-[10px] leading-5 text-white/38">CMS writes require Supabase. The rows below are the built-in fallback projects.</p> : null}
      <div className="mt-7 border-t border-white/14">
        {projects.map((project, index) => (
          <article key={project.slug} className="grid gap-4 border-b border-white/8 py-5 md:grid-cols-[40px_1fr_110px_90px_auto] md:items-center">
            <span className="font-[var(--font-mono)] text-[8px] text-white/28">{String(index + 1).padStart(2, "0")}</span>
            <div><h2 className="text-[13px] font-semibold">{project.title}</h2><p className="mt-1 text-[9px] text-white/36">{project.type} · /projects/{project.slug}</p></div>
            <span className="text-[10px] text-white/45">{project.featured ? "Featured" : "Standard"}</span>
            <span className={`w-fit rounded-full border px-2 py-1 font-[var(--font-mono)] text-[7px] uppercase tracking-[0.08em] ${project.status === "draft" ? "border-amber-400/30 text-amber-300/70" : project.status === "archived" ? "border-white/10 text-white/30" : "border-emerald-400/30 text-emerald-300/70"}`}>{project.status || "published"}</span>
            <div className="flex flex-wrap gap-3 text-[10px] font-semibold">
              {project.id ? <Link href={`/admin/projects/${project.id}`} className="text-white/55 hover:text-white">Edit</Link> : <span className="text-white/24">Fallback</span>}
              {project.id ? <Link href={`/admin/preview/${project.id}`} className="text-white/45 hover:text-white">Preview</Link> : null}
              {project.id ? <form action={moveProjectAction} className="flex gap-2"><input type="hidden" name="id" value={project.id} /><button name="direction" value="up" className="text-white/35 hover:text-white" type="submit">↑</button><button name="direction" value="down" className="text-white/35 hover:text-white" type="submit">↓</button></form> : null}
              {project.id ? <form action={deleteProjectAction}><input type="hidden" name="id" value={project.id} /><button className="text-[#f17a62]/75 hover:text-[#f17a62]" type="submit">Delete</button></form> : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
