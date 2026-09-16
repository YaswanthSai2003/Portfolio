"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-lg border border-[#d95239]/30 bg-[#d95239]/5 p-7">
        <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-[#f17a62]">ADMIN ERROR</p>
        <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em]">That action could not be completed.</h1>
        <p className="mt-3 text-[10px] leading-5 text-white/45">{error.message || "Check your database/storage configuration and try again."}</p>
        <button onClick={reset} className="mt-5 bg-[#eef0f1] px-4 py-2 text-[10px] font-bold text-[#111]">Try again</button>
      </div>
    </div>
  );
}
