export function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-5 border-b border-white/8 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.13em] text-white/32">{eyebrow}</p>
        <h1 className="mt-2 font-[var(--font-display)] text-[clamp(38px,4vw,58px)] font-semibold tracking-[-0.06em]">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-[11px] leading-6 text-white/42">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="border border-white/8 bg-white/[0.018] p-5">
      <span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.11em] text-white/30">{label}</span>
      <strong className="mt-6 block font-[var(--font-display)] text-4xl tracking-[-0.05em]">{value}</strong>
      {detail ? <span className="mt-2 block text-[9px] text-white/32">{detail}</span> : null}
    </div>
  );
}

export const fieldLabel = "block border-b border-white/10 py-4";
export const fieldName = "mb-2 block font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-white/34";
export const fieldInput = "w-full bg-transparent py-1 text-[12px] text-white outline-none placeholder:text-white/20";
