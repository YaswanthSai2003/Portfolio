import { AdminPageHeader } from "@/components/admin/admin-ui";
import { dbSelect, hasSupabase } from "@/lib/supabase-rest";
import { updateMessageStatusAction } from "../actions";

type Message = {
  id: string;
  reference: string;
  type: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default async function AdminInboxPage() {
  const messages = hasSupabase()
    ? await dbSelect<Message>("contact_messages", "select=*&order=created_at.desc&limit=100").catch(() => [])
    : [];
  return (
    <>
      <AdminPageHeader eyebrow="MESSAGES" title="Inbox" description="Contact submissions from the public site. The portfolio never attempts to become an email client; reply using the sender's email address." />
      <div className="mt-8 border-t border-white/14">
        {messages.length ? messages.map((item) => (
          <article key={item.id} className="grid gap-5 border-b border-white/8 py-6 lg:grid-cols-[170px_1fr_160px]">
            <div><span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-white/28">{item.reference}</span><p className="mt-3 text-[10px] text-white/40">{new Date(item.created_at).toLocaleString()}</p><span className={`mt-3 inline-block rounded-full border px-2 py-1 font-[var(--font-mono)] text-[7px] uppercase tracking-[0.08em] ${item.status === "new" ? "border-[#d95239]/35 text-[#f17a62]" : "border-white/10 text-white/35"}`}>{item.status}</span></div>
            <div><p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.11em] text-white/30">{item.type}</p><h2 className="mt-2 text-[14px] font-semibold">{item.name}{item.company ? ` · ${item.company}` : ""}</h2><a href={`mailto:${item.email}`} className="mt-1 inline-block text-[10px] text-white/44 hover:text-white">{item.email}</a><p className="mt-5 max-w-3xl whitespace-pre-wrap text-[11px] leading-6 text-white/55">{item.message}</p></div>
            <form action={updateMessageStatusAction} className="flex flex-wrap content-start gap-2 lg:justify-end"><input type="hidden" name="id" value={item.id} />{["read", "replied", "archived"].map((status) => <button key={status} name="status" value={status} className="border border-white/10 px-3 py-2 text-[8px] uppercase tracking-[0.07em] text-white/42 hover:border-white/25 hover:text-white" type="submit">{status}</button>)}</form>
          </article>
        )) : <div className="py-12 text-[11px] text-white/35">{hasSupabase() ? "No messages yet." : "Connect Supabase to store messages in the admin inbox."}</div>}
      </div>
    </>
  );
}
