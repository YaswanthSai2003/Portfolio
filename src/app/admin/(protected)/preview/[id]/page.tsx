import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjectsForAdmin } from "@/lib/content";

export default async function ProjectPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = (await getAllProjectsForAdmin()).find((item) => item.id === id);
  if (!project) notFound();
  const image = project.gallery?.[0]?.image || project.coverImage;
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/8 pb-5">
        <div><p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/28">DRAFT PREVIEW</p><h1 className="mt-2 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.055em]">{project.title}</h1></div>
        <Link href={`/admin/projects/${id}`} className="text-[10px] text-white/50">Back to editor ←</Link>
      </div>
      <div className="mx-auto mt-10 max-w-6xl bg-[#eef0f1] p-6 text-[#151515] sm:p-10 dark:bg-[#eef0f1] dark:text-[#151515]">
        <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-black/42">{project.type} / {project.year}</p>
        <h2 className="mt-4 font-[var(--font-display)] text-[clamp(60px,8vw,110px)] font-semibold leading-[.88] tracking-[-0.07em]">{project.title}</h2>
        <p className="mt-6 max-w-3xl text-[15px] leading-8">{project.summary}</p>
        {image ? <div className="mt-10 overflow-hidden border border-black/12 bg-white">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={image} alt={`${project.title} preview`} className="aspect-[16/9] w-full object-cover object-top" /></div> : null}
        <div className="mt-10 grid gap-8 border-t border-black/15 pt-8 md:grid-cols-2"><div><p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-black/38">Problem</p><p className="mt-3 text-[12px] leading-6 text-black/62">{project.caseStudy.problem}</p></div><div><p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-black/38">Approach</p><p className="mt-3 text-[12px] leading-6 text-black/62">{project.caseStudy.approach}</p></div></div>
      </div>
    </div>
  );
}
