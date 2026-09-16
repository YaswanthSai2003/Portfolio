import { dbInsert, hasSupabase } from "./supabase-rest";

export async function writeAudit(action: string, entityType?: string, entityId?: string, metadata?: Record<string, unknown>) {
  if (!hasSupabase()) return;
  try {
    await dbInsert("audit_logs", {
      action,
      entity_type: entityType || null,
      entity_id: entityId || null,
      metadata: metadata || {},
    });
  } catch {
    // Audit logging should not break the user action.
  }
}
