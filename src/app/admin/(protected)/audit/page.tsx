import { AdminPageHeader } from "@/components/admin/admin-ui";
import { dbSelect, hasSupabase } from "@/lib/supabase-rest";

type Audit = { id: number; action: string; entity_type: string | null; entity_id: string | null; metadata: Record<string, unknown>; created_at: string };

export default async function AdminAuditPage() {
  const items = hasSupabase() ? await dbSelect<Audit>("audit_logs", "select=*&order=created_at.desc&limit=100").catch(() => []) : [];
  return (
    <>
      <AdminPageHeader eyebrow="SECURITY / HISTORY" title="Audit log" description="Important admin changes are recorded so content and document updates remain traceable." />
      <div className="mt-8 border-t border-white/14">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 border-b border-white/8 py-4 text-[9px] sm:grid-cols-[180px_180px_1fr]">
            <span className="text-white/34">{new Date(item.created_at).toLocaleString()}</span>
            <strong className="text-white/62">{item.action}</strong>
            <span className="text-white/34">{item.entity_type || "system"}{item.entity_id ? ` · ${item.entity_id}` : ""}</span>
          </div>
        ))}
        {!items.length ? <p className="py-12 text-[11px] text-white/35">{hasSupabase() ? "No audit entries yet." : "Connect Supabase to enable the audit log."}</p> : null}
      </div>
    </>
  );
}
