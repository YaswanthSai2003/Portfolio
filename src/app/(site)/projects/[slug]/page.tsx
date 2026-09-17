import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Project } from "@/data/projects";

import {
  GenericArchitectureVisual,
  ObjectDetectionVisual,
  ReviewAgentVisual,
} from "@/components/project-visuals";

import {
  TrackedLink,
} from "@/components/tracked-link";

import {
  getProjectBySlug,
  getPublishedProjects,
} from "@/lib/content";

const shell =
  "mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-8";

const kicker =
  "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-black/38 dark:text-white/38";

export const revalidate = 60;

type ProjectData =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getProjectBySlug
      >
    >
  >;

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

function withVersion(
  src?: string,
) {
  if (!src) {
    return undefined;
  }

  return `${src}${
    src.includes("?")
      ? "&"
      : "?"
  }portfolio=v34`;
}

function RepositoryAction({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const visibility =
    getRepositoryVisibility(
      project,
    );

  if (
    visibility === "private"
  ) {
    return (
      <span
        className={`
          inline-flex
          items-center
          gap-2

          ${
            compact
              ? "text-black/42 dark:text-white/42"
              : `
                min-h-9
                rounded-full
                border
                border-black/8
                bg-black/[0.015]
                px-4
                text-black/46

                dark:border-white/10
                dark:bg-white/[0.025]
                dark:text-white/46
              `
          }
        `}
      >
        <span
          className="
            relative
            size-2.5
            shrink-0
          "
          aria-hidden="true"
        >
          <span
            className="
              absolute
              bottom-0
              left-[1px]
              h-[6px]
              w-[8px]
              rounded-[2px]
              border
              border-current
            "
          />

          <span
            className="
              absolute
              left-[3px]
              top-0
              h-[5px]
              w-[4px]
              rounded-t-full
              border
              border-b-0
              border-current
            "
          />
        </span>

        Private repository
      </span>
    );
  }

  if (
    visibility !== "public" ||
    !project.githubUrl
  ) {
    return null;
  }

  if (compact) {
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
          text-black/58
          transition
          hover:text-black

          dark:text-white/58
          dark:hover:text-white
        "
      >
        GitHub

        <span
          className="
            transition-transform
            duration-200

            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
          "
        >
          ↗
        </span>
      </TrackedLink>
    );
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
        min-h-9
        items-center
        gap-2
        rounded-full
        border
        border-black/10
        px-4
        text-black/60
        transition
        duration-200

        hover:-translate-y-0.5
        hover:border-black/30
        hover:text-black

        dark:border-white/12
        dark:text-white/60
        dark:hover:border-white/30
        dark:hover:text-white
      "
    >
      GitHub repository

      <span
        className="
          transition-transform
          duration-200

          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
        "
      >
        ↗
      </span>
    </TrackedLink>
  );
}

function LiveAction({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  if (
    !project.liveUrl
  ) {
    return null;
  }

  if (compact) {
    return (
      <TrackedLink
        href={
          project.liveUrl
        }
        eventType="demo_click"
        projectSlug={
          project.slug
        }
        className="
          group
          inline-flex
          items-center
          gap-2
          text-emerald-800
          transition
          hover:text-emerald-950

          dark:text-emerald-300
          dark:hover:text-emerald-200
        "
      >
        Live product

        <span
          className="
            transition-transform
            duration-200

            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
          "
        >
          ↗
        </span>
      </TrackedLink>
    );
  }

  return (
    <TrackedLink
      href={
        project.liveUrl
      }
      eventType="demo_click"
      projectSlug={
        project.slug
      }
      className="
        group
        inline-flex
        min-h-9
        items-center
        gap-2
        rounded-full
        border
        border-emerald-700/18
        bg-emerald-700/[0.04]
        px-4
        text-emerald-800
        transition
        duration-200

        hover:-translate-y-0.5
        hover:border-emerald-700/30
        hover:bg-emerald-700/[0.07]

        dark:border-emerald-300/18
        dark:bg-emerald-300/[0.04]
        dark:text-emerald-300
        dark:hover:border-emerald-300/30
        dark:hover:bg-emerald-300/[0.07]
      "
    >
      Live product

      <span
        className="
          transition-transform
          duration-200

          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
        "
      >
        ↗
      </span>
    </TrackedLink>
  );
}

export async function generateMetadata({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const project =
    await getProjectBySlug(
      slug,
    );

  if (!project) {
    return {};
  }

  return {
    title:
      project.title,

    description:
      project.summary,

    openGraph: {
      title:
        project.title,

      description:
        project.summary,

      type:
        "article",

      images:
        project.slug !==
          "averlen" &&
        project.coverImage
          ? [
              project.coverImage,
            ]
          : undefined,
    },
  };
}

function AverlenCaseStudyGallery({
  project,
}: {
  project: ProjectData;
}) {
  const overview =
    withVersion(
      project.gallery?.find(
        (item) =>
          item.label
            .toLowerCase()
            .includes(
              "overview",
            ),
      )?.image ||
        project.coverImage,
    );

  const pricing =
    withVersion(
      project.gallery?.find(
        (item) =>
          item.label
            .toLowerCase()
            .includes(
              "pricing",
            ),
      )?.image,
    );

  const analytics =
    withVersion(
      project.gallery?.find(
        (item) =>
          item.label
            .toLowerCase()
            .includes(
              "analytics",
            ),
      )?.image,
    );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* MAIN PRODUCT VIEW */}

      <div
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-black/8

          bg-[linear-gradient(180deg,#eff1f2_0%,#e7eaec_100%)]

          p-3

          shadow-[0_22px_60px_rgba(22,22,22,.07)]

          dark:border-white/8
          dark:bg-[#181c21]

          sm:p-4
        "
      >
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-4
            rounded-[14px]

            border
            border-black/7

            bg-white/55

            px-4
            py-2

            font-[var(--font-mono)]
            text-[8px]
            uppercase
            tracking-[0.12em]
            text-black/34

            dark:border-white/8
            dark:bg-white/[0.025]
            dark:text-white/34
          "
        >
          <span>
            Averlen / Product
          </span>

          <span>
            Overview
          </span>
        </div>

        {overview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                overview
              }
              alt="Averlen overview dashboard"
              className="
                block
                w-full
                rounded-[18px]
                border
                border-black/8
                bg-white
                object-contain
                shadow-[0_10px_28px_rgba(20,20,20,.05)]
              "
            />
          </>
        ) : null}
      </div>

      {/* SECONDARY PRODUCT VIEWS */}

      <div
        className="
          grid
          gap-5

          lg:grid-cols-2
        "
      >
        {pricing ? (
          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-black/8
              bg-[#e6e9eb]
              p-3

              shadow-[0_18px_40px_rgba(22,22,22,.045)]

              dark:border-white/8
              dark:bg-[#181c21]
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                gap-4
                px-1

                font-[var(--font-mono)]
                text-[8px]
                uppercase
                tracking-[0.12em]
                text-black/34

                dark:text-white/34
              "
            >
              <span>
                Pricing
              </span>

              <span>
                Recommendations
              </span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                pricing
              }
              alt="Averlen pricing dashboard"
              className="
                block
                w-full
                rounded-[15px]
                border
                border-black/8
                bg-white
                object-contain
              "
            />
          </div>
        ) : null}

        {analytics ? (
          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-black/8
              bg-[#e6e9eb]
              p-3

              shadow-[0_18px_40px_rgba(22,22,22,.045)]

              dark:border-white/8
              dark:bg-[#181c21]
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                gap-4
                px-1

                font-[var(--font-mono)]
                text-[8px]
                uppercase
                tracking-[0.12em]
                text-black/34

                dark:text-white/34
              "
            >
              <span>
                Analytics
              </span>

              <span>
                Performance
              </span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                analytics
              }
              alt="Averlen analytics dashboard"
              className="
                block
                w-full
                rounded-[15px]
                border
                border-black/8
                bg-white
                object-contain
              "
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProjectVisual({
  project,
}: {
  project: ProjectData;
}) {
  const media =
    project.gallery?.[0]
      ?.image ||
    project.coverImage;

  if (
    project.slug ===
    "averlen"
  ) {
    return (
      <AverlenCaseStudyGallery
        project={
          project
        }
      />
    );
  }

  if (media) {
    const src =
      withVersion(
        media,
      );

    return (
      <div
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-black/8
          bg-[#e6e9eb]
          p-2

          shadow-[0_20px_55px_rgba(20,20,20,.07)]

          dark:border-white/8
          dark:bg-[#181c21]

          sm:p-3
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={
            project.gallery?.[0]
              ?.alt ||
            `${project.title} project preview`
          }
          className="
            aspect-[16/9.5]
            w-full
            rounded-[17px]
            object-cover
            object-top
          "
        />
      </div>
    );
  }

  if (
    project.slug ===
    "pr-review-agent"
  ) {
    return (
      <ReviewAgentVisual />
    );
  }

  if (
    project.slug ===
    "object-detection"
  ) {
    return (
      <ObjectDetectionVisual />
    );
  }

  if (
    project.architecture
      ?.nodes?.length
  ) {
    return (
      <GenericArchitectureVisual
        project={
          project
        }
      />
    );
  }

  return null;
}

export default async function ProjectPage({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}) {
  const {
    slug,
  } =
    await params;

  const project =
    await getProjectBySlug(
      slug,
    );

  if (!project) {
    notFound();
  }

  const publishedProjects =
    await getPublishedProjects();

  const currentIndex =
    publishedProjects.findIndex(
      (item) =>
        item.slug ===
        project.slug,
    );

  const nextProject =
    publishedProjects.length >
    1
      ? publishedProjects[
          (
            currentIndex +
            1 +
            publishedProjects.length
          ) %
            publishedProjects.length
        ]
      : undefined;

  const repositoryVisibility =
    getRepositoryVisibility(
      project,
    );

  const hasLinks =
    Boolean(
      project.liveUrl,
    ) ||
    repositoryVisibility !==
      "none";

  return (
    <article
      className={`
        ${shell}

        pb-24
        pt-10

        sm:pt-14
      `}
    >
      {/* BACK */}

      <Link
        href="/#work"
        className="
          inline-flex
          items-center
          gap-2

          text-[11px]
          font-semibold
          text-black/45

          transition
          hover:text-black

          dark:text-white/45
          dark:hover:text-white
        "
      >
        <span
          className="
            transition-transform
            duration-200
            group-hover:-translate-x-1
          "
        >
          ←
        </span>

        Back to projects
      </Link>

      {/* HERO */}

      <header
        className="
          grid
          gap-10

          border-b
          border-black/10

          pb-12
          pt-12

          dark:border-white/10

          lg:grid-cols-[1.15fr_.85fr]
          lg:items-end
          lg:gap-16
          lg:pb-16
          lg:pt-16
        "
      >
        <div>
          <p className={kicker}>
            {project.type}
            {" · "}
            {project.year}
          </p>

          <h1
            className="
              mt-5

              font-[var(--font-display)]
              text-[clamp(52px,6.5vw,92px)]
              font-semibold
              leading-[0.9]
              tracking-[-0.066em]
            "
          >
            {project.title}
          </h1>
        </div>

        <div>
          <p
            className="
              max-w-[560px]

              text-[14px]
              leading-7
              text-black/54

              dark:text-white/54
            "
          >
            {
              project
                .caseStudy
                .overview
            }
          </p>

          {(project.liveUrl ||
            repositoryVisibility !==
              "none") ? (
            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-2.5

                text-[10px]
                font-semibold
              "
            >
              <LiveAction
                project={
                  project
                }
              />

              <RepositoryAction
                project={
                  project
                }
              />
            </div>
          ) : null}
        </div>
      </header>

      {/* PROJECT META */}

      <section
        className="
          grid
          gap-6

          border-b
          border-black/8

          py-6

          dark:border-white/8

          sm:grid-cols-3
        "
      >
        <div>
          <p className={kicker}>
            ROLE
          </p>

          <p
            className="
              mt-2
              text-[11px]
              font-semibold
              leading-6
            "
          >
            {project.role ||
              "Engineering"}
          </p>
        </div>

        <div>
          <p className={kicker}>
            STACK
          </p>

          <p
            className="
              mt-2

              text-[11px]
              font-semibold
              leading-6
            "
          >
            {project.stack.join(
              " · ",
            )}
          </p>
        </div>

        <div>
          <p className={kicker}>
            OUTCOME
          </p>

          <p
            className="
              mt-2

              max-w-md

              text-[11px]
              leading-6
              text-black/48

              dark:text-white/48
            "
          >
            {project.result}
          </p>
        </div>
      </section>

      {/* PRODUCT VISUAL */}

      <section
        className="
          py-12

          lg:py-16
        "
      >
        <ProjectVisual
          project={
            project
          }
        />
      </section>

      {/* PROBLEM / APPROACH */}

      <section
        className="
          grid
          gap-10

          border-y
          border-black/10

          py-14

          dark:border-white/10

          md:grid-cols-2
          md:gap-14

          lg:py-16
        "
      >
        <div>
          <p className={kicker}>
            PROBLEM
          </p>

          <h2
            className="
              mt-4

              font-[var(--font-display)]
              text-[32px]
              font-semibold
              tracking-[-0.045em]
            "
          >
            What needed solving
          </h2>

          <p
            className="
              mt-4
              max-w-xl

              text-[12px]
              leading-7
              text-black/52

              dark:text-white/52
            "
          >
            {
              project
                .caseStudy
                .problem
            }
          </p>
        </div>

        <div>
          <p className={kicker}>
            APPROACH
          </p>

          <h2
            className="
              mt-4

              font-[var(--font-display)]
              text-[32px]
              font-semibold
              tracking-[-0.045em]
            "
          >
            How I approached it
          </h2>

          <p
            className="
              mt-4
              max-w-xl

              text-[12px]
              leading-7
              text-black/52

              dark:text-white/52
            "
          >
            {
              project
                .caseStudy
                .approach
            }
          </p>
        </div>
      </section>

      {/* ENGINEERING */}

      {project.caseStudy
        .engineering
        .length ? (
        <section
          className="
            grid
            gap-10

            py-14

            lg:grid-cols-[.38fr_1.62fr]
            lg:gap-16
            lg:py-16
          "
        >
          <div>
            <p className={kicker}>
              ENGINEERING
            </p>

            <h2
              className="
                mt-4
                max-w-[300px]

                font-[var(--font-display)]
                text-[36px]
                font-semibold
                leading-[1.02]
                tracking-[-0.05em]
              "
            >
              Implementation
              highlights
            </h2>
          </div>

          <div
            className="
              grid
              gap-px

              overflow-hidden

              border
              border-black/8

              bg-black/8

              dark:border-white/8
              dark:bg-white/8

              sm:grid-cols-2
            "
          >
            {project.caseStudy
              .engineering
              .map(
                (
                  item,
                  index,
                ) => (
                  <div
                    key={
                      item
                    }
                    className="
                      bg-[#e6e9eb]
                      p-5

                      dark:bg-[#171b21]

                      sm:p-6
                    "
                  >
                    <span
                      className="
                        font-[var(--font-mono)]
                        text-[8px]
                        tracking-[0.1em]
                        text-[#d96d45]
                      "
                    >
                      {String(
                        index +
                          1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <strong
                      className="
                        mt-4
                        block

                        text-[12px]
                        font-semibold
                        leading-6
                        text-black/76

                        dark:text-white/76
                      "
                    >
                      {item}
                    </strong>
                  </div>
                ),
              )}
          </div>
        </section>
      ) : null}

      {/* DECISIONS */}

      {project.caseStudy
        .decisions
        ?.length ? (
        <section
          className="
            border-t
            border-black/10

            py-14

            dark:border-white/10

            lg:py-16
          "
        >
          <div
            className="
              grid
              gap-10

              lg:grid-cols-[.38fr_1.62fr]
              lg:gap-16
            "
          >
            <div>
              <p className={kicker}>
                KEY DECISIONS
              </p>

              <h2
                className="
                  mt-4
                  max-w-[300px]

                  font-[var(--font-display)]
                  text-[36px]
                  font-semibold
                  leading-[1.02]
                  tracking-[-0.05em]
                "
              >
                Trade-offs and
                choices
              </h2>
            </div>

            <div
              className="
                grid
                gap-4

                sm:grid-cols-2
              "
            >
              {project.caseStudy
                .decisions.map(
                  (
                    decision,
                    index,
                  ) => (
                    <article
                      key={
                        decision.title
                      }
                      className="
                        border
                        border-black/8

                        p-5

                        transition-colors

                        hover:border-black/16

                        dark:border-white/8
                        dark:hover:border-white/16

                        sm:p-6
                      "
                    >
                      <span
                        className="
                          font-[var(--font-mono)]
                          text-[8px]
                          tracking-[0.1em]
                          text-[#d96d45]
                        "
                      >
                        {String(
                          index +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <h3
                        className="
                          mt-4

                          text-[16px]
                          font-semibold
                          tracking-[-0.025em]
                          text-black/80

                          dark:text-white/80
                        "
                      >
                        {
                          decision.title
                        }
                      </h3>

                      <p
                        className="
                          mt-3

                          text-[10px]
                          leading-6
                          text-black/48

                          dark:text-white/48
                        "
                      >
                        {
                          decision.copy
                        }
                      </p>
                    </article>
                  ),
                )}
            </div>
          </div>
        </section>
      ) : null}

      {/* SUMMARY */}

      <section
        className="
          border-y
          border-black/10

          py-10

          dark:border-white/10

          lg:py-12
        "
      >
        <div
          className="
            grid
            gap-8

            lg:grid-cols-[.62fr_1.38fr]
            lg:gap-16
          "
        >
          <div>
            <p className={kicker}>
              ENGINEERING SUMMARY
            </p>

            <h2
              className="
                mt-4
                max-w-[340px]

                font-[var(--font-display)]
                text-[34px]
                font-semibold
                leading-[1.02]
                tracking-[-0.05em]
              "
            >
              What this project
              is built on.
            </h2>
          </div>

          <div
            className="
              divide-y
              divide-black/10

              border-y
              border-black/10

              dark:divide-white/10
              dark:border-white/10
            "
          >
            <div
              className="
                grid
                gap-3
                py-4

                sm:grid-cols-[140px_1fr]
                sm:items-start
              "
            >
              <p className={kicker}>
                TECHNOLOGY
              </p>

              <p
                className="
                  text-[12px]
                  font-semibold
                  leading-6
                  text-black/72

                  dark:text-white/72
                "
              >
                {project.stack.join(
                  " · ",
                )}
              </p>
            </div>

            <div
              className="
                grid
                gap-3
                py-4

                sm:grid-cols-[140px_1fr]
                sm:items-start
              "
            >
              <p className={kicker}>
                ROLE
              </p>

              <p
                className="
                  text-[12px]
                  font-semibold
                  leading-6
                  text-black/72

                  dark:text-white/72
                "
              >
                {project.role ||
                  "Engineering"}
              </p>
            </div>

            <div
              className="
                grid
                gap-3
                py-4

                sm:grid-cols-[140px_1fr]
                sm:items-start
              "
            >
              <p className={kicker}>
                OUTCOME
              </p>

              <p
                className="
                  max-w-2xl

                  text-[11px]
                  leading-6
                  text-black/50

                  dark:text-white/50
                "
              >
                {project.result}
              </p>
            </div>

            {hasLinks ? (
              <div
                className="
                  grid
                  gap-3
                  py-4

                  sm:grid-cols-[140px_1fr]
                  sm:items-center
                "
              >
                <p className={kicker}>
                  LINKS
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-6
                    gap-y-3

                    text-[11px]
                    font-semibold
                  "
                >
                  <LiveAction
                    project={
                      project
                    }
                    compact
                  />

                  <RepositoryAction
                    project={
                      project
                    }
                    compact
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* NEXT PROJECT */}

      <section
        className="
          py-8

          lg:py-10
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-6

            border-b
            border-black/10

            pb-4

            dark:border-white/10
          "
        >
          <Link
            href="/#work"
            className="
              text-[10px]
              font-semibold
              text-black/48
              transition

              hover:text-black

              dark:text-white/48
              dark:hover:text-white
            "
          >
            ← All projects
          </Link>

          <Link
            href="/#contact"
            className="
              text-[10px]
              font-semibold
              text-black/48
              transition

              hover:text-black

              dark:text-white/48
              dark:hover:text-white
            "
          >
            Contact
          </Link>
        </div>

        {nextProject &&
        nextProject.slug !==
          project.slug ? (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="
              group
              grid
              gap-5

              border-b
              border-black/10

              py-7

              transition-colors

              hover:bg-black/[0.018]

              dark:border-white/10
              dark:hover:bg-white/[0.018]

              sm:grid-cols-[130px_1fr_auto]
              sm:items-end
              sm:py-9
            "
          >
            <div>
              <p className={kicker}>
                NEXT PROJECT
              </p>

              <p
                className="
                  mt-2

                  text-[9px]
                  uppercase
                  tracking-[0.1em]
                  text-black/34

                  dark:text-white/34
                "
              >
                {
                  nextProject.type
                }
              </p>
            </div>

            <div>
              <h2
                className="
                  font-[var(--font-display)]
                  text-[clamp(34px,4.8vw,64px)]
                  font-semibold
                  leading-[.92]
                  tracking-[-0.06em]
                "
              >
                {
                  nextProject.title
                }
              </h2>

              <p
                className="
                  mt-3
                  max-w-[680px]

                  text-[10px]
                  leading-5
                  text-black/42

                  dark:text-white/42
                "
              >
                {
                  nextProject.summary
                }
              </p>
            </div>

            <span
              className="
                pb-1

                text-[26px]
                text-black/32

                transition-transform
                duration-300

                group-hover:translate-x-2

                dark:text-white/32
              "
            >
              →
            </span>
          </Link>
        ) : null}
      </section>
    </article>
  );
}