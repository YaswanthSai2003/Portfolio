import Link from "next/link";
import type { Project } from "@/data/projects";
import { AverlenProductPreview } from "@/components/averlen-product-preview";
import { TrackedLink } from "@/components/tracked-link";

const shell =
  "mx-auto w-[min(1420px,calc(100%_-_64px))] max-sm:w-[calc(100%_-_32px)]";

const kicker =
  "font-[var(--font-mono)] text-[8px] uppercase tracking-[0.14em]";

function getProject(projects: Project[], slug: string) {
  return projects.find((project) => project.slug === slug);
}

function getRepositoryVisibility(
  project: Project,
) {
  return (
    project.repositoryVisibility ||
    (
      project.githubUrl
        ? "public"
        : "none"
    )
  );
}

function RepositoryAction({
  project,
}: {
  project: Project;
}) {
  const visibility =
    getRepositoryVisibility(
      project,
    );

  if (
    visibility ===
    "private"
  ) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-2
          text-[#c9825b]
          dark:text-[#d99a78]
        "
      >
        <span
          aria-hidden="true"
          className="
            size-1.5
            rounded-full
            bg-[#c9825b]
            dark:bg-[#d99a78]
          "
        />

        Private repository
      </span>
    );
  }

  if (
    visibility !==
      "public" ||
    !project.githubUrl
  ) {
    return null;
  }

  return (
    <TrackedLink
      href={
        project.githubUrl
      }
      eventType="github_click"
      projectSlug={
        project.slug
      }
      className="
        group
        inline-flex
        items-center
        gap-2
        text-black/48
        transition
        hover:text-black
        dark:text-white/48
        dark:hover:text-white
      "
    >
      GitHub

      <span
        className="
          transition-transform
          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
        "
      >
        ↗
      </span>
    </TrackedLink>
  );
}

function FeatureActions({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold">
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex items-center gap-2 text-black/76 underline decoration-black/20 underline-offset-4 transition hover:text-black hover:decoration-black/60 dark:text-white/76 dark:decoration-white/20 dark:hover:text-white dark:hover:decoration-white/60"
      >
        View case study
      </Link>

      {project.liveUrl ? (
        <TrackedLink
          href={project.liveUrl}
          eventType="demo_click"
          projectSlug={project.slug}
          className="group inline-flex items-center gap-2 text-emerald-800 transition hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Live product
          <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </TrackedLink>
      ) : null}

      <RepositoryAction
        project={project}
      />
    </div>
  );
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-semibold">
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex items-center gap-2 text-black/62 underline decoration-black/15 underline-offset-4 transition hover:text-black hover:decoration-black/50 dark:text-white/62 dark:decoration-white/15 dark:hover:text-white dark:hover:decoration-white/50"
      >
        Case study
      </Link>

      <RepositoryAction
        project={project}
      />

      {project.liveUrl ? (
        <TrackedLink
          href={project.liveUrl}
          eventType="demo_click"
          projectSlug={project.slug}
          className="group inline-flex items-center gap-2 text-emerald-800 transition hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Live
          <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </TrackedLink>
      ) : null}
    </div>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="group border-b border-black/10 py-7 transition-colors dark:border-white/10 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-[52px_1.2fr_.68fr] lg:items-center lg:gap-8">
        <span className="font-[var(--font-mono)] text-[8px] text-black/24 dark:text-white/24">
          {String(index).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/projects/${project.slug}`}
              className="group/title"
            >
              <h3 className="font-[var(--font-display)] text-[clamp(29px,2.6vw,42px)] font-semibold leading-[.95] tracking-[-0.055em] transition group-hover/title:text-black/60 dark:group-hover/title:text-white/60">
                {project.title}
              </h3>
            </Link>

            {project.liveUrl ? (
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                title="Live project"
              />
            ) : null}
          </div>

          <p className="mt-3 max-w-[640px] text-[10.5px] leading-6 text-black/44 dark:text-white/44">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((item) => (
              <span
                key={item}
                className="rounded-full border border-black/8 px-2.5 py-1 font-[var(--font-mono)] text-[6.5px] uppercase tracking-[0.07em] text-black/34 dark:border-white/10 dark:text-white/34"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <ProjectActions project={project} />
          </div>
        </div>

        <div className="border-l border-black/10 pl-5 dark:border-white/10">
          <p
            className={`${kicker} text-black/26 dark:text-white/26`}
          >
            Project profile
          </p>

          <p className="mt-3 text-[10px] leading-5 text-black/44 dark:text-white/44">
            {project.type}
          </p>

          <p className="mt-3 text-[9px] leading-5 text-black/32 dark:text-white/32">
            {project.role || "Engineering"}
          </p>
        </div>
      </div>
    </article>
  );
}

export function ProjectShowcase({
  projects,
}: {
  projects: Project[];
}) {
  const averlen = getProject(projects, "averlen");

  const remaining = projects
    .filter(
      (project) =>
        project.slug !== "averlen" &&
        project.slug !== "pr-review-agent" &&
        project.status === "published",
    )
    .sort(
      (a, b) =>
        (a.sortOrder ?? 99) - (b.sortOrder ?? 99),
    );

  if (!averlen) {
    return null;
  }

  const overviewImage =
    averlen.gallery?.find((item) =>
      item.label.toLowerCase().includes("overview"),
    )?.image ||
    averlen.coverImage ||
    "/projects/averlen-overview-2026.png";

  const pricingImage =
    averlen.gallery?.find((item) =>
      item.label.toLowerCase().includes("pricing"),
    )?.image ||
    "/projects/averlen-pricing-2026.png";

  return (
    <section
      id="work"
      className="
        scroll-mt-[72px]
        border-y border-black/10
        bg-[linear-gradient(180deg,#eef1ef_0%,#f3f3ef_100%)]
        dark:border-white/10
        dark:bg-[linear-gradient(180deg,#111416_0%,#101113_100%)]
      "
    >
      {/* FEATURED PROJECT */}
      <div className={`${shell} py-14 lg:py-20`}>
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <span className={`${kicker} text-[#d96d45]`}>
            01 / Featured project
          </span>

          <span className="h-px w-8 bg-black/10 dark:bg-white/12" />

          <span
            className={`${kicker} text-black/28 dark:text-white/28`}
          >
            {averlen.year}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.28fr_.72fr] lg:items-center lg:gap-14 xl:gap-18">
          <div className="min-w-0">
            <AverlenProductPreview
              overviewImage={overviewImage}
              pricingImage={pricingImage}
            />
          </div>

          <div className="max-w-[500px] lg:justify-self-end">
            <p
              className={`${kicker} text-black/32 dark:text-white/32`}
            >
              Revenue intelligence / hospitality
            </p>

            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(58px,6vw,88px)] font-semibold leading-[.88] tracking-[-0.075em]">
              Averlen
            </h2>

            <p className="mt-6 text-[17px] leading-8 text-black/72 dark:text-white/72">
              Revenue intelligence for hospitality teams — bringing
              booking ingestion, analytics, pricing and AI-assisted
              insight into one multi-tenant product.
            </p>

            <p className="mt-4 text-[11.5px] leading-7 text-black/46 dark:text-white/46">
              Designed and built end to end across product UI,
              backend APIs, tenant boundaries, analytics workflows,
              caching and pricing logic.
            </p>

            <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
              <p
                className={`${kicker} text-black/36 dark:text-white/36`}
              >
                Development stack
              </p>

              <ul className="mt-4 grid gap-x-8 gap-y-2 text-[12px] font-medium text-black/68 dark:text-white/68 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {[
                  "FastAPI",
                  "PostgreSQL",
                  "Redis",
                  "React + TypeScript",
                  "SQLModel / Alembic",
                  "Docker",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <span className="size-1 rounded-full bg-[#d96d45]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <FeatureActions project={averlen} />
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED PROJECTS */}
      <div className="border-t border-black/10 dark:border-white/10">
        <div className={`${shell} py-14 lg:py-18`}>
          <div className="grid gap-8 lg:grid-cols-[.42fr_1.58fr] lg:gap-14">
            <div>
              <div className="flex items-center gap-3">
                <span className={`${kicker} text-[#d96d45]`}>
                  02 / Selected projects
                </span>

                <span className="h-px w-8 bg-black/10 dark:bg-white/10" />
              </div>

              <h3 className="mt-5 max-w-[390px] font-[var(--font-display)] text-[clamp(42px,4.4vw,66px)] font-semibold leading-[0.92] tracking-[-0.062em]">
                Built across
                <br />
                the stack.
              </h3>

              <p className="mt-6 max-w-[340px] text-[11px] leading-7 text-black/42 dark:text-white/42">
                Backend systems, full-stack products and applied
                machine learning — selected projects spanning APIs,
                data, product interfaces and computer vision.
              </p>

              <div className="mt-8 flex items-center gap-3 font-[var(--font-mono)] text-[7px] uppercase tracking-[0.1em] text-black/26 dark:text-white/26">
                <span>
                  {String(remaining.length).padStart(2, "0")} projects
                </span>
              </div>
            </div>

            <div>
              {remaining.map((project, index) => (
                <ProjectRow
                  key={project.slug}
                  project={project}
                  index={index + 2}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}