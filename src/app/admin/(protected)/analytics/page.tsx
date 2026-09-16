import { AdminPageHeader, StatCard } from "@/components/admin/admin-ui";
import { dbSelect, hasSupabase } from "@/lib/supabase-rest";

type Event = {
  id: number;
  session_id: string;
  event_type: string;
  path: string;
  project_slug: string | null;
  referrer: string | null;
  device_class: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  created_at: string;
};

function countBy<T extends string | null>(items: T[]) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = item || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function AdminAnalyticsPage() {
  const events = hasSupabase()
    ? await dbSelect<Event>("analytics_events", "select=*&order=created_at.desc&limit=500").catch(() => [])
    : [];
  const visitors = new Set(events.map((event) => event.session_id)).size;
  const pageViews = events.filter((event) => event.event_type === "page_view").length;
  const githubClicks = events.filter((event) => event.event_type === "github_click").length;
  const demoClicks = events.filter((event) => event.event_type === "demo_click").length;
  const devices = countBy(events.map((event) => event.device_class));
  const browsers = countBy(events.map((event) => event.browser));
  const pages = countBy(events.filter((event) => event.event_type === "page_view").map((event) => event.path));

  const sessionMap = new Map<string, { last: string; device: string | null; browser: string | null; os: string | null; country: string | null; referrer: string | null; views: number }>();
  for (const event of events) {
    const current = sessionMap.get(event.session_id);
    if (!current) {
      sessionMap.set(event.session_id, { last: event.created_at, device: event.device_class, browser: event.browser, os: event.os, country: event.country, referrer: event.referrer, views: event.event_type === "page_view" ? 1 : 0 });
    } else if (event.event_type === "page_view") {
      current.views += 1;
    }
  }
  const recentSessions = [...sessionMap.entries()].slice(0, 10);

  return (
    <>
      <AdminPageHeader eyebrow="PRIVATE ANALYTICS" title="Analytics" description="Lightweight first-party signals only. Sessions are anonymous, raw IP addresses are never stored, and the dashboard is private." />
      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitors" value={visitors || "—"} detail="Unique anonymous sessions" />
        <StatCard label="Page views" value={pageViews || "—"} detail="Last 500 events" />
        <StatCard label="GitHub clicks" value={githubClicks || "—"} detail="Tracked project links" />
        <StatCard label="Demo clicks" value={demoClicks || "—"} detail="Tracked live links" />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          ["Top pages", pages],
          ["Devices", devices],
          ["Browsers", browsers],
        ].map(([title, rows]) => (
          <div key={title as string} className="border border-white/8 bg-white/[0.012] p-5">
            <h2 className="text-[12px] font-semibold">{title as string}</h2>
            <div className="mt-5 border-t border-white/8">
              {(rows as [string, number][]).slice(0, 6).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-white/8 py-3 text-[9px]"><span className="truncate text-white/45">{label}</span><strong>{value}</strong></div>
              ))}
              {!(rows as [string, number][]).length ? <p className="py-6 text-[9px] text-white/28">No data yet.</p> : null}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 border border-white/8 bg-white/[0.012] p-5">
        <div className="flex items-end justify-between gap-4"><div><p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.11em] text-white/28">RECENT SESSIONS</p><h2 className="mt-2 text-[12px] font-semibold">Anonymous visitor journeys</h2></div><span className="text-[8px] text-white/28">No raw IPs</span></div>
        <div className="mt-5 border-t border-white/8">
          {recentSessions.map(([sessionId, session]) => (
            <div key={sessionId} className="grid gap-2 border-b border-white/8 py-4 text-[9px] sm:grid-cols-[1fr_1fr_80px] sm:items-center">
              <div><strong className="text-white/62">{session.device || "Unknown"} · {session.browser || "Browser"}</strong><p className="mt-1 text-white/30">{session.os || "Unknown OS"}{session.country ? ` · ${session.country}` : ""}</p></div>
              <div><p className="text-white/42">Last seen {new Date(session.last).toLocaleString()}</p><p className="mt-1 truncate text-white/28">{session.referrer || "Direct / unknown source"}</p></div>
              <div className="sm:text-right"><strong>{session.views}</strong><span className="ml-1 text-white/30">views</span></div>
            </div>
          ))}
          {!recentSessions.length ? <p className="py-6 text-[9px] text-white/28">No sessions yet.</p> : null}
        </div>
      </section>

      <div className="mt-8 border-t border-white/14">
        <div className="grid grid-cols-[110px_1fr_90px_90px] gap-3 border-b border-white/8 py-3 font-[var(--font-mono)] text-[7px] uppercase tracking-[0.1em] text-white/28 max-sm:hidden"><span>When</span><span>Event</span><span>Device</span><span>Browser</span></div>
        {events.slice(0, 30).map((event) => (
          <div key={event.id} className="grid gap-2 border-b border-white/8 py-3 text-[9px] text-white/44 sm:grid-cols-[110px_1fr_90px_90px] sm:gap-3">
            <span>{new Date(event.created_at).toLocaleString()}</span>
            <span>{event.event_type} · {event.project_slug || event.path}</span>
            <span>{event.device_class || "—"}</span>
            <span>{event.browser || "—"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
