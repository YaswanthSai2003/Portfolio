import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CopyButton } from "@/components/admin/copy-button";
import { dbSelect, hasSupabase } from "@/lib/supabase-rest";
import { uploadMediaAction } from "../actions";

type Media = { id: string; file_name: string; public_url: string; mime_type: string; size_bytes: number; created_at: string };

export default async function AdminMediaPage() {
  const items = hasSupabase() ? await dbSelect<Media>("media_assets", "select=*&order=created_at.desc&limit=100").catch(() => []) : [];
  return (
    <>
      <AdminPageHeader eyebrow="ASSETS" title="Media" description="Upload project screenshots once, then reuse the returned URL in project galleries and cover images." />
      <form action={uploadMediaAction} className="mt-8 flex flex-col gap-4 border border-white/8 bg-white/[0.015] p-5 sm:flex-row sm:items-end">
        <label className="flex-1"><span className="mb-2 block font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-white/32">Image</span><input type="file" name="file" accept="image/*" required className="block w-full text-[10px] text-white/50 file:mr-3 file:border-0 file:bg-white/8 file:px-3 file:py-2 file:text-[9px] file:text-white" /></label>
        <button type="submit" className="min-h-10 bg-[#eef0f1] px-4 text-[10px] font-bold text-[#111]">Upload</button>
      </form>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden border border-white/8 bg-white/[0.012]">
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.public_url} alt={item.file_name} className="aspect-[16/9] w-full object-cover" />
            <div className="p-4"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="truncate text-[10px] font-semibold">{item.file_name}</p><p className="mt-1 text-[8px] text-white/30">{(item.size_bytes / 1024).toFixed(0)} KB</p></div><CopyButton value={item.public_url} /></div><input readOnly value={item.public_url} className="mt-3 w-full bg-transparent font-[var(--font-mono)] text-[8px] text-white/38 outline-none" /></div>
          </article>
        ))}
      </div>
      {!items.length ? <p className="mt-8 text-[11px] text-white/35">{hasSupabase() ? "No uploaded media yet." : "Connect Supabase to enable uploads."}</p> : null}
    </>
  );
}
