"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  ["Overview", "/admin"],
  ["Projects", "/admin/projects"],
  ["Resume", "/admin/resume"],
  ["Inbox", "/admin/inbox"],
  ["Analytics", "/admin/analytics"],
  ["Media", "/admin/media"],
  ["Settings", "/admin/settings"],
  ["Security", "/admin/security"],
  ["Audit", "/admin/audit"],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#12151a] text-[#eef0f1] lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="sticky top-0 z-40 border-b border-white/8 bg-[#12151a]/95 backdrop-blur lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-auto lg:px-6 lg:py-7">
          <Link href="/admin" className="font-[var(--font-display)] text-lg font-bold tracking-[-0.04em]">PORTFOLIO<span className="text-[#d95239]">OS</span></Link>
          <button type="button" className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-white/50 lg:hidden" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
        </div>

        <nav className={`${open ? "block" : "hidden"} border-t border-white/8 px-4 pb-5 lg:block lg:border-0 lg:px-4`}>
          <p className="hidden px-3 pb-3 font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/28 lg:block">Workspace</p>
          <div className="grid gap-1">
            {nav.map(([label, href]) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center justify-between rounded-md px-3 py-2.5 text-[12px] transition ${active ? "bg-white/9 text-white" : "text-white/48 hover:bg-white/[0.045] hover:text-white/75"}`}>
                  <span>{label}</span>{active ? <span className="size-1.5 rounded-full bg-[#d95239]" /> : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="hidden absolute inset-x-0 bottom-0 border-t border-white/8 p-4 lg:block">
          <Link href="/" className="block rounded-md px-3 py-2 text-[11px] text-white/48 transition hover:bg-white/[0.045] hover:text-white">View public site</Link>
          <form action="/api/admin/logout" method="post"><button className="mt-1 w-full rounded-md px-3 py-2 text-left text-[11px] text-white/38 transition hover:bg-white/[0.045] hover:text-white" type="submit">Sign out</button></form>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10 lg:py-10 xl:px-14">{children}</div>
      </main>
    </div>
  );
}
