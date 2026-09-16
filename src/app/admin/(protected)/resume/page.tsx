import { AdminPageHeader } from "@/components/admin/admin-ui";
import { dbSelect, hasSupabase } from "@/lib/supabase-rest";
import { activateResumeAction, uploadResumeAction } from "../actions";

type ResumeRow = {
  id: string;
  label: string;
  file_name: string;
  file_size: number;
  is_active: boolean;
  uploaded_at: string;
};

export default async function AdminResumePage() {
  const items = hasSupabase()
    ? await dbSelect<ResumeRow>("resume_versions", "select=id,label,file_name,file_size,is_active,uploaded_at&order=uploaded_at.desc").catch(() => [])
    : [];
  return (
    <>
      <AdminPageHeader eyebrow="DOCUMENTS" title="Resume" description="Keep resume history private and expose only one active PDF through a stable public URL." />
      <div className="mt-8 grid gap-8 xl:grid-cols-[360px_1fr]">
        <form action={uploadResumeAction} className="border border-white/8 bg-white/[0.015] p-5">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/30">Upload version</p>
          <label className="mt-5 block border-b border-white/10 pb-4"><span className="mb-2 block text-[9px] text-white/38">Label</span><input name="label" className="w-full bg-transparent text-[12px] outline-none placeholder:text-white/20" placeholder="Sep 2026" /></label>
          <label className="block border-b border-white/10 py-4"><span className="mb-2 block text-[9px] text-white/38">PDF</span><input name="file" type="file" accept="application/pdf" required className="block w-full text-[10px] text-white/50 file:mr-3 file:border-0 file:bg-white/8 file:px-3 file:py-2 file:text-[9px] file:text-white" /></label>
          <button type="submit" className="mt-5 min-h-10 w-full bg-[#eef0f1] px-4 text-[10px] font-bold text-[#111]">Upload resume</button>
          {!hasSupabase() ? <p className="mt-4 text-[9px] leading-5 text-[#f17a62]/75">Connect Supabase before uploading files.</p> : null}
        </form>

        <div className="border-t border-white/14">
          {items.length ? items.map((item) => (
            <article key={item.id} className="grid gap-4 border-b border-white/8 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3"><h2 className="text-[13px] font-semibold">{item.label}</h2>{item.is_active ? <span className="rounded-full border border-emerald-400/30 px-2 py-1 font-[var(--font-mono)] text-[7px] uppercase tracking-[0.08em] text-emerald-300/75">Active</span> : null}</div>
                <p className="mt-1 text-[9px] text-white/34">{item.file_name} · {(item.file_size / 1024).toFixed(0)} KB · {new Date(item.uploaded_at).toLocaleDateString()}</p>
              </div>
              {!item.is_active ? <form action={activateResumeAction}><input type="hidden" name="id" value={item.id} /><button type="submit" className="text-[10px] font-semibold text-white/55 hover:text-white">Set active</button></form> : <a href="/api/resume/current" target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-white/55 hover:text-white">Preview ↗</a>}
            </article>
          )) : <div className="py-12 text-[11px] text-white/35">No resume versions yet.</div>}
        </div>
      </div>
    </>
  );
}
