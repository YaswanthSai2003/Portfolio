import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenericArchitectureVisual, ObjectDetectionVisual, ReviewAgentVisual } from "@/components/project-visuals";
import { TrackedLink } from "@/components/tracked-link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";

const shell = "mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-8";
const kicker = "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-black/38 dark:text-white/38";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: project.slug !== "averlen" && project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

function withVersion(src?: string) {
  if (!src) return undefined;
  return `${src}${src.includes("?") ? "&" : "?"}portfolio=v33`;
}

function AverlenCaseStudyGallery({ project }: { project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>> }) {
  const overview = withVersion(project.gallery?.find((item) => item.label.toLowerCase().includes("overview"))?.image || project.coverImage);
  const pricing = withVersion(project.gallery?.find((item) => item.label.toLowerCase().includes("pricing"))?.image);
  const analytics = withVersion(project.gallery?.find((item) => item.label.toLowerCase().includes("analytics"))?.image);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#eff1f2_0%,#e7eaec_100%)] p-3 shadow-[0_22px_60px_rgba(22,22,22,.08)] dark:border-white/8 dark:bg-[#1d2229] sm:p-4">
        <div className="mb-3 flex items-center justify-between rounded-[18px] border border-black/8 bg-white/65 px-4 py-2 text-[9px] font-[var(--font-mono)] uppercase tracking-[0.12em] text-black/35 dark:border-white/8 dark:bg-white/[0.03] dark:text-white/35">
          <span>Averlen / Product walkthrough</span>
          <span>Overview</span>
        </div>
        {overview ? (
          <img
            src={overview}
            alt="Averlen overview dashboard"
            className="block w-full rounded-[22px] border border-black/8 bg-white object-contain shadow-[0_10px_28px_rgba(20,20,20,.06)] dark:border-white/8 dark:bg-[#1d2229]"
          />
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {pricing ? (
          <div className="overflow-hidden rounded-[24px] border border-black/8 bg-[#e6e9eb] p-3 shadow-[0_18px_40px_rgba(22,22,22,.05)] dark:border-white/8 dark:bg-[#1d2229]">
            <div className="mb-3 flex items-center justify-between px-1 text-[9px] font-[var(--font-mono)] uppercase tracking-[0.12em] text-black/35 dark:text-white/35">
              <span>Pricing</span>
              <span>Portfolio recommendations</span>
            </div>
            <img
              src={pricing}
              alt="Averlen pricing dashboard"
              className="block w-full rounded-[18px] border border-black/8 bg-white object-contain dark:border-white/8 dark:bg-[#1d2229]"
            />
          </div>
        ) : null}

        {analytics ? (
          <div className="overflow-hidden rounded-[24px] border border-black/8 bg-[#e6e9eb] p-3 shadow-[0_18px_40px_rgba(22,22,22,.05)] dark:border-white/8 dark:bg-[#1d2229]">
            <div className="mb-3 flex items-center justify-between px-1 text-[9px] font-[var(--font-mono)] uppercase tracking-[0.12em] text-black/35 dark:text-white/35">
              <span>Analytics</span>
              <span>Performance trends</span>
            </div>
            <img
              src={analytics}
              alt="Averlen analytics dashboard"
              className="block w-full rounded-[18px] border border-black/8 bg-white object-contain dark:border-white/8 dark:bg-[#1d2229]"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>> }) {
  const media = project.gallery?.[0]?.image || project.coverImage;

  if (project.slug === "averlen") {
    return <AverlenCaseStudyGallery project={project} />;
  }

  if (media) {
    const src = withVersion(media);
    return (
      <div className="overflow-hidden rounded-[26px] border border-black/8 bg-[#e6e9eb] p-2 shadow-[0_20px_55px_rgba(20,20,20,.08)] dark:border-white/8 dark:bg-[#1d2229] sm:p-3">
        <img
          src={src}
          alt={project.gallery?.[0]?.alt || `${project.title} project preview`}
          className="aspect-[16/9.5] w-full rounded-[19px] object-cover object-top"
        />
      </div>
    );
  }

  if (project.slug === "pr-review-agent") return <ReviewAgentVisual />;
  if (project.slug === "object-detection") return <ObjectDetectionVisual />;
  if (project.architecture?.nodes?.length) return <GenericArchitectureVisual project={project} />;
  return null;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const publishedProjects = await getPublishedProjects();
  const currentIndex = publishedProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = publishedProjects.length > 1
    ? publishedProjects[(currentIndex + 1 + publishedProjects.length) % publishedProjects.length]
    : undefined;

  return (
    <article className={`${shell} pb-24 pt-10 sm:pt-14`}>
      <Link href="/#work" className="text-[11px] font-semibold text-black/45 transition hover:text-black dark:text-white/45 dark:hover:text-white">← Back to projects</Link>

      <header className="grid gap-10 border-b border-black/10 pb-12 pt-12 dark:border-white/10 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-16 lg:pb-16 lg:pt-16">
        <div>
          <p className={kicker}>{project.type} · {project.year}</p>
          <h1 className="mt-5 font-[var(--font-display)] text-[clamp(52px,6.5vw,92px)] font-semibold leading-[0.9] tracking-[-0.066em]">{project.title}</h1>
        </div>
        <div>
          <p className="text-[14px] leading-7 text-black/54 dark:text-white/54">{project.caseStudy.overview}</p>
          <div className="mt-6 flex flex-wrap gap-2.5 text-[10px] font-semibold">
            {project.liveUrl ? (
              <TrackedLink href={project.liveUrl} eventType="demo_click" projectSlug={project.slug} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-700/18 bg-emerald-700/[0.04] px-4 text-emerald-800 transition hover:-translate-y-0.5 dark:border-emerald-300/18 dark:bg-emerald-300/[0.04] dark:text-emerald-300">Live product ↗</TrackedLink>
            ) : null}
            {project.githubUrl ? (
              <TrackedLink href={project.githubUrl} eventType="github_click" projectSlug={project.slug} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-black/10 px-4 text-black/60 transition hover:-translate-y-0.5 hover:border-black dark:border-white/12 dark:text-white/60 dark:hover:border-white">GitHub repository ↗</TrackedLink>
            ) : null}
          </div>
        </div>
      </header>

      <section className="grid gap-6 border-b border-black/8 py-6 dark:border-white/8 sm:grid-cols-3">
        <div>
          <p className={kicker}>ROLE</p>
          <p className="mt-2 text-[11px] font-semibold">{project.role || "Engineering"}</p>
        </div>
        <div>
          <p className={kicker}>STACK</p>
          <p className="mt-2 text-[11px] font-semibold leading-6">{project.stack.join(" · ")}</p>
        </div>
        <div>
          <p className={kicker}>OUTCOME</p>
          <p className="mt-2 text-[11px] leading-6 text-black/48 dark:text-white/48">{project.result}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <ProjectVisual project={project} />
      </section>

      <section className="grid gap-10 border-y border-black/10 py-14 dark:border-white/10 md:grid-cols-2 md:gap-14 lg:py-18">
        <div>
          <p className={kicker}>PROBLEM</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[32px] font-semibold tracking-[-0.045em]">What needed solving</h2>
          <p className="mt-4 max-w-xl text-[12px] leading-7 text-black/52 dark:text-white/52">{project.caseStudy.problem}</p>
        </div>
        <div>
          <p className={kicker}>APPROACH</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[32px] font-semibold tracking-[-0.045em]">How I approached it</h2>
          <p className="mt-4 max-w-xl text-[12px] leading-7 text-black/52 dark:text-white/52">{project.caseStudy.approach}</p>
        </div>
      </section>

      <section className="grid gap-10 py-16 lg:grid-cols-[.38fr_1.62fr] lg:gap-16">
        <div>
          <p className={kicker}>ENGINEERING</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[36px] font-semibold leading-[1.02] tracking-[-0.05em]">Implementation highlights</h2>
        </div>
        <div className="grid gap-px bg-black/8 dark:bg-white/8 sm:grid-cols-2">
          {project.caseStudy.engineering.map((item, index) => (
            <div key={item} className="bg-[#e6e9eb] p-5 dark:bg-[#1d2229]">
              <span className="font-[var(--font-mono)] text-[8px] text-[#db8f4b]">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-3 block text-[12px] leading-6">{item}</strong>
            </div>
          ))}
        </div>
      </section>

      {project.caseStudy.decisions?.length ? (
        <section className="border-t border-black/10 py-16 dark:border-white/10">
          <div className="grid gap-10 lg:grid-cols-[.38fr_1.62fr] lg:gap-16">
            <div>
              <p className={kicker}>KEY DECISIONS</p>
              <h2 className="mt-4 font-[var(--font-display)] text-[36px] font-semibold leading-[1.02] tracking-[-0.05em]">Trade-offs and choices</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {project.caseStudy.decisions.map((decision, index) => (
                <div key={decision.title} className="rounded-[22px] border border-black/8 p-5 dark:border-white/8">
                  <span className="font-[var(--font-mono)] text-[8px] text-[#db8f4b]">0{index + 1}</span>
                  <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.025em]">{decision.title}</h3>
                  <p className="mt-3 text-[10px] leading-6 text-black/48 dark:text-white/48">{decision.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-black/10 py-10 dark:border-white/10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
          <div>
            <p className={kicker}>ENGINEERING SUMMARY</p>
            <h2 className="mt-4 max-w-[340px] font-[var(--font-display)] text-[34px] font-semibold leading-[1.02] tracking-[-0.05em]">What this project is built on.</h2>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
            <div className="grid gap-3 py-4 sm:grid-cols-[140px_1fr] sm:items-start">
              <p className={kicker}>TECHNOLOGY</p>
              <p className="text-[12px] font-semibold leading-6 text-black/72 dark:text-white/72">{project.stack.join(" · ")}</p>
            </div>
            <div className="grid gap-3 py-4 sm:grid-cols-[140px_1fr] sm:items-start">
              <p className={kicker}>ROLE</p>
              <p className="text-[12px] font-semibold leading-6 text-black/72 dark:text-white/72">{project.role || "Engineering"}</p>
            </div>
            <div className="grid gap-3 py-4 sm:grid-cols-[140px_1fr] sm:items-start">
              <p className={kicker}>OUTCOME</p>
              <p className="max-w-2xl text-[11px] leading-6 text-black/50 dark:text-white/50">{project.result}</p>
            </div>
            {(project.liveUrl || project.githubUrl) ? (
              <div className="grid gap-3 py-4 sm:grid-cols-[140px_1fr] sm:items-center">
                <p className={kicker}>LINKS</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold">
                  {project.liveUrl ? (
                    <TrackedLink href={project.liveUrl} eventType="demo_click" projectSlug={project.slug} className="group inline-flex items-center gap-2">
                      Live product <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                    </TrackedLink>
                  ) : null}
                  {project.githubUrl ? (
                    <TrackedLink href={project.githubUrl} eventType="github_click" projectSlug={project.slug} className="group inline-flex items-center gap-2">
                      GitHub <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                    </TrackedLink>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-10">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
          <Link href="/#work" className="text-[10px] font-semibold text-black/48 transition hover:text-black dark:text-white/48 dark:hover:text-white">← All projects</Link>
          <Link href="/#contact" className="text-[10px] font-semibold text-black/48 transition hover:text-black dark:text-white/48 dark:hover:text-white">Contact</Link>
        </div>

        {nextProject && nextProject.slug !== project.slug ? (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group grid gap-5 border-b border-black/10 py-7 transition hover:bg-black/[0.018] dark:border-white/10 dark:hover:bg-white/[0.018] sm:grid-cols-[130px_1fr_auto] sm:items-end sm:py-9"
          >
            <div>
              <p className={kicker}>NEXT PROJECT</p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.1em] text-black/34 dark:text-white/34">{nextProject.type}</p>
            </div>
            <div>
              <h2 className="font-[var(--font-display)] text-[clamp(34px,4.8vw,64px)] font-semibold leading-[.92] tracking-[-0.06em]">{nextProject.title}</h2>
              <p className="mt-3 max-w-[680px] text-[10px] leading-5 text-black/42 dark:text-white/42">{nextProject.summary}</p>
            </div>
            <span className="pb-1 text-[26px] text-black/32 transition-transform group-hover:translate-x-2 dark:text-white/32">→</span>
          </Link>
        ) : null}
      </section>
    </article>
  );
}
