import type { Project } from "@/data/projects";

const mono = "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.14em]";

export function AverlenSystemVisual() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0f1728] p-5 text-white shadow-[0_26px_70px_rgba(15,23,40,.18)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`${mono} text-white/40`}>Averlen / revenue intelligence</p>
            <h3 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] sm:text-[28px]">Bookings → signals → decisions</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[9px] text-white/48">
            {['Multi-tenant', 'RBAC', 'Cached', 'API-first'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">{item}</span>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[.72fr_1.15fr_.9fr] lg:items-stretch">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className={`${mono} text-white/35`}>01 / INPUT</p>
            <div className="mt-6 rounded-xl border border-white/10 bg-[#0b1220] p-4">
              <div className="flex items-center justify-between text-[10px] text-white/48">
                <span>bookings.csv</span>
                <span>CSV</span>
              </div>
              <div className="mt-4 space-y-2 font-[var(--font-mono)] text-[8px] text-white/34">
                <div className="grid grid-cols-3 gap-2"><span>property</span><span>check_in</span><span>price</span></div>
                <div className="grid grid-cols-3 gap-2 text-white/60"><span>Beach Villa</span><span>15 Mar</span><span>9500</span></div>
                <div className="grid grid-cols-3 gap-2 text-white/60"><span>City Studio</span><span>18 Mar</span><span>4200</span></div>
                <div className="grid grid-cols-3 gap-2 text-white/60"><span>Hill Cottage</span><span>20 Mar</span><span>6100</span></div>
              </div>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-white/40">Preview, map columns, validate and ingest data as a tracked job.</p>
          </div>

          <div className="rounded-2xl border border-[#8585ff]/30 bg-[#8585ff]/[0.08] p-5 shadow-[inset_0_0_0_1px_rgba(133,133,255,.05)]">
            <div className="flex items-center justify-between gap-4">
              <p className={`${mono} text-[#aaaaff]`}>02 / AVERLEN CORE</p>
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,.09)]" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Ingestion', 'preview · mapping · jobs'],
                ['Analytics', 'revenue · occupancy · properties'],
                ['Pricing', 'preview · generate · history'],
                ['AI insights', 'context · reasoning · guardrails'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-[#10192b] p-4 transition hover:-translate-y-0.5 hover:border-[#8585ff]/40">
                  <strong className="text-[13px] font-semibold">{title}</strong>
                  <p className="mt-2 text-[9px] leading-5 text-white/36">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center font-[var(--font-mono)] text-[8px] uppercase tracking-[0.08em] text-white/32">
              <span className="rounded-lg border border-white/8 py-2">FastAPI</span>
              <span className="rounded-lg border border-white/8 py-2">Postgres</span>
              <span className="rounded-lg border border-white/8 py-2">Redis</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className={`${mono} text-white/35`}>03 / OUTPUT</p>
            <div className="mt-6 space-y-3">
              {[
                ['Revenue analytics', 'Understand portfolio performance'],
                ['Pricing actions', 'Review and save recommendations'],
                ['AI insights', 'Ask questions against trusted context'],
              ].map(([title, copy], index) => (
                <div key={title} className="group rounded-xl border border-white/10 bg-[#0b1220] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-[12px] font-semibold">{title}</strong>
                    <span className="text-[10px] text-[#8f90ff]">0{index + 1}</span>
                  </div>
                  <p className="mt-2 text-[9px] leading-5 text-white/36">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 text-[9px] text-white/34 sm:flex-row sm:items-center sm:justify-between">
          <p>Organization-scoped data · route guards · safe mutations · background job status</p>
          <p className="font-[var(--font-mono)] uppercase tracking-[0.11em]">Product + backend system</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewAgentVisual() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-[#111318] text-white shadow-[0_26px_70px_rgba(17,19,24,.14)] dark:border-white/8">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-6">
        <span className={`${mono} text-white/38`}>PR #184 / review in progress</span>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-emerald-300">revision pinned</span>
      </div>

      <div className="grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="border-b border-white/8 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="rounded-2xl border border-white/8 bg-[#0c0f14] p-4 font-[var(--font-mono)] text-[9px] leading-6">
            <div className="text-white/32">@@ invoice_service.py</div>
            <div className="mt-2 text-rose-300/80">- invoice = db.get(invoice_id)</div>
            <div className="text-emerald-300/90">+ invoice = db.get_for_org(invoice_id, org_id)</div>
            <div className="mt-2 text-white/42">&nbsp;&nbsp;if not invoice:</div>
            <div className="text-white/42">&nbsp;&nbsp;&nbsp;&nbsp;raise NotFound()</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {['Security', 'Correctness', 'Testing', 'Maintainability'].map((item) => (
              <div key={item} className="rounded-xl border border-white/8 bg-white/[0.025] px-3 py-3 text-center text-[9px] font-medium text-white/52">{item}</div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <p className={`${mono} text-white/34`}>VALIDATOR</p>
          <div className="mt-5 space-y-3">
            {[
              ['Finding supported', 'pass'],
              ['Current revision checked', 'pass'],
              ['Duplicate comments removed', 'pass'],
              ['Line still exists', 'pass'],
            ].map(([label]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3">
                <span className="text-[10px] text-white/54">{label}</span>
                <span className="text-emerald-300">✓</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-[#8585ff]/25 bg-[#8585ff]/8 p-4">
            <p className="text-[10px] font-semibold text-[#c5c5ff]">Publish only feedback that still applies to the latest code.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ObjectDetectionVisual() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-[#e6e9eb] p-5 shadow-[0_26px_70px_rgba(20,20,20,.08)] sm:p-7 dark:border-white/8 dark:bg-[#1d2229]">
      <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-5 dark:border-white/8">
        <span className={`${mono} text-black/38 dark:text-white/38`}>Computer vision / model pipeline</span>
        <span className="text-[9px] text-black/38 dark:text-white/38">Faster R-CNN</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.95fr]">
        <div className="relative min-h-[270px] overflow-hidden rounded-2xl bg-[#151821] p-5 text-white">
          <div className="absolute left-[14%] top-[19%] h-[48%] w-[31%] border-2 border-[#8f90ff]" />
          <div className="absolute right-[14%] top-[32%] h-[34%] w-[24%] border-2 border-[#60d3aa]" />
          <span className="absolute left-[14%] top-[12%] bg-[#8f90ff] px-2 py-1 font-[var(--font-mono)] text-[8px] text-black">object · .96</span>
          <span className="absolute right-[14%] top-[25%] bg-[#60d3aa] px-2 py-1 font-[var(--font-mono)] text-[8px] text-black">object · .91</span>
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between font-[var(--font-mono)] text-[8px] uppercase tracking-[0.09em] text-white/30">
            <span>conceptual inference preview</span>
            <span>bbox + confidence</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ['01', 'Dataset', 'Images + labelled bounding boxes'],
            ['02', 'Train', 'Faster R-CNN learns class + location'],
            ['03', 'Evaluate', 'Confidence, IoU and mAP'],
          ].map(([number, title, copy]) => (
            <div key={title} className="rounded-2xl border border-black/8 bg-white/60 p-4 dark:border-white/8 dark:bg-white/[0.035]">
              <span className="font-[var(--font-mono)] text-[8px] text-[#db8f4b]">{number}</span>
              <strong className="mt-3 block text-[14px] tracking-[-0.025em]">{title}</strong>
              <p className="mt-2 text-[9px] leading-5 text-black/42 dark:text-white/42">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GenericArchitectureVisual({ project }: { project: Project }) {
  const nodes = project.architecture?.nodes || [];
  return (
    <div className="rounded-[26px] border border-black/8 bg-black/[0.02] p-5 sm:p-7 dark:border-white/8 dark:bg-white/[0.025]">
      <p className={`${mono} text-black/38 dark:text-white/38`}>{project.architecture?.eyebrow || "System flow"}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {nodes.slice(0, 5).map((node, index) => (
          <div key={node.label} className="rounded-2xl border border-black/8 bg-white/60 p-4 dark:border-white/8 dark:bg-white/[0.025]">
            <span className="font-[var(--font-mono)] text-[8px] text-[#db8f4b]">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-4 block text-[14px] tracking-[-0.02em]">{node.label}</strong>
            {node.description ? <p className="mt-2 text-[9px] leading-5 text-black/42 dark:text-white/42">{node.description}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
