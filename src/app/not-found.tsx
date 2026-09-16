import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0f1] px-6 text-[#141416] dark:bg-[#12151a] dark:text-[#f4f4f2]">
      <div className="max-w-2xl text-center">
        <p className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-black/38 dark:text-white/38">404 / NOT FOUND</p>
        <h1 className="mt-5 font-[var(--font-display)] text-[clamp(58px,8vw,112px)] font-semibold leading-[0.84] tracking-[-0.072em]">Nothing useful here.</h1>
        <p className="mx-auto mt-7 max-w-md text-[13px] leading-7 text-black/48 dark:text-white/48">The page may have moved, or the project is not currently published.</p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#151515] px-5 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black">Back to portfolio</Link>
      </div>
    </main>
  );
}
