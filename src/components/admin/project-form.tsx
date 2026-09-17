import type { Project } from "@/data/projects";
import { saveProjectAction } from "@/app/admin/(protected)/actions";
import {
  fieldInput,
  fieldLabel,
  fieldName,
} from "./admin-ui";

const selectInput = `${fieldInput} [color-scheme:dark]`;

function architectureText(
  project?: Project,
) {
  return (
    project?.architecture?.nodes
      .map(
        (node) =>
          `${node.label}${
            node.description
              ? ` | ${node.description}`
              : ""
          }`,
      )
      .join("\n") || ""
  );
}

function galleryText(
  project?: Project,
) {
  return (
    project?.gallery
      ?.map(
        (item) =>
          `${item.label} | ${item.image} | ${item.alt}${
            item.description
              ? ` | ${item.description}`
              : ""
          }`,
      )
      .join("\n") || ""
  );
}

function repositoryVisibility(
  project?: Project,
) {
  return (
    project?.repositoryVisibility ||
    (project?.githubUrl
      ? "public"
      : "none")
  );
}

export function ProjectForm({
  project,
}: {
  project?: Project;
}) {
  return (
    <form
      action={saveProjectAction}
      className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]"
    >
      {project?.id ? (
        <input
          type="hidden"
          name="id"
          value={project.id}
        />
      ) : null}

      <section className="border-t border-white/14">
        <div className="grid md:grid-cols-2">
          <label
            className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}
          >
            <span className={fieldName}>Title</span>
            <input
              className={fieldInput}
              name="title"
              defaultValue={project?.title}
              required
            />
          </label>

          <label className={`${fieldLabel} md:pl-6`}>
            <span className={fieldName}>Slug</span>
            <input
              className={fieldInput}
              name="slug"
              defaultValue={project?.slug}
              required
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2">
          <label
            className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}
          >
            <span className={fieldName}>Type</span>
            <input
              className={fieldInput}
              name="type"
              defaultValue={project?.type}
              required
            />
          </label>

          <label className={`${fieldLabel} md:pl-6`}>
            <span className={fieldName}>Role / scope</span>
            <input
              className={fieldInput}
              name="role"
              defaultValue={project?.role}
            />
          </label>
        </div>

        <label className={fieldLabel}>
          <span className={fieldName}>Summary</span>
          <textarea
            className={`${fieldInput} min-h-24 resize-y leading-6`}
            name="summary"
            defaultValue={project?.summary}
            required
          />
        </label>

        <label className={fieldLabel}>
          <span className={fieldName}>
            Result / why it matters
          </span>
          <textarea
            className={`${fieldInput} min-h-20 resize-y leading-6`}
            name="result"
            defaultValue={project?.result}
            required
          />
        </label>

        <div className="mt-8 border-y border-white/10 py-6">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/30">
            LINKS & ACCESS
          </p>

          <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/38">
            Links are stored in the project row in Supabase. A private repository is shown as a status and never exposes its URL.
          </p>

          <div className="mt-5 grid md:grid-cols-2">
            <label
              className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}
            >
              <span className={fieldName}>
                Repository access
              </span>
              <select
                className={selectInput}
                style={{ colorScheme: "dark" }}
                name="repositoryVisibility"
                defaultValue={repositoryVisibility(project)}
              >
                <option value="public" className="bg-[#12151a] text-white">
                  Public repository
                </option>
                <option value="private" className="bg-[#12151a] text-white">
                  Private repository
                </option>
                <option value="none" className="bg-[#12151a] text-white">
                  No repository
                </option>
              </select>
              <small className="mt-2 block text-[8px] leading-4 text-white/30">
                Public requires a GitHub URL. Private shows a non-clickable status. None hides repository information completely.
              </small>
            </label>

            <label className={`${fieldLabel} md:pl-6`}>
              <span className={fieldName}>GitHub URL</span>
              <input
                className={fieldInput}
                type="url"
                name="githubUrl"
                placeholder="https://github.com/username/project"
                defaultValue={project?.githubUrl || ""}
              />
              <small className="mt-2 block text-[8px] leading-4 text-white/30">
                Used only when Repository access is Public.
              </small>
            </label>
          </div>

          <label className={fieldLabel}>
            <span className={fieldName}>
              Live product / demo URL
            </span>
            <input
              className={fieldInput}
              type="url"
              name="liveUrl"
              placeholder="https://example.com"
              defaultValue={project?.liveUrl || ""}
            />
            <small className="mt-2 block text-[8px] leading-4 text-white/30">
              Optional. Leave empty and no Live link will be rendered.
            </small>
          </label>
        </div>

        <label className={fieldLabel}>
          <span className={fieldName}>
            Technology stack · comma separated
          </span>
          <input
            className={fieldInput}
            name="stack"
            defaultValue={project?.stack.join(", ")}
          />
        </label>

        <div className="mt-10">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/30">
            Case study
          </p>

          <label className={fieldLabel}>
            <span className={fieldName}>Overview</span>
            <textarea
              className={`${fieldInput} min-h-20 resize-y leading-6`}
              name="overview"
              defaultValue={project?.caseStudy.overview}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Problem</span>
            <textarea
              className={`${fieldInput} min-h-24 resize-y leading-6`}
              name="problem"
              defaultValue={project?.caseStudy.problem}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Approach</span>
            <textarea
              className={`${fieldInput} min-h-24 resize-y leading-6`}
              name="approach"
              defaultValue={project?.caseStudy.approach}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>
              Engineering focus · one item per line
            </span>
            <textarea
              className={`${fieldInput} min-h-36 resize-y font-[var(--font-mono)] text-[10px] leading-6`}
              name="engineering"
              defaultValue={project?.caseStudy.engineering.join(
                "\n",
              )}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>
              Engineering decisions · Title | Explanation
            </span>
            <textarea
              className={`${fieldInput} min-h-28 resize-y font-[var(--font-mono)] text-[9px] leading-5`}
              name="decisions"
              defaultValue={
                project?.caseStudy.decisions
                  ?.map(
                    (item) =>
                      `${item.title} | ${item.copy}`,
                  )
                  .join("\n") || ""
              }
            />
          </label>
        </div>
      </section>

      <aside>
        <div className="sticky top-8 border border-white/8 bg-white/[0.015] p-5">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/30">
            Publishing
          </p>

          <label className={fieldLabel}>
            <span className={fieldName}>Status</span>
            <select
              className={selectInput}
              style={{ colorScheme: "dark" }}
              name="status"
              defaultValue={project?.status || "draft"}
            >
              <option value="draft" className="bg-[#12151a] text-white">Draft</option>
              <option value="published" className="bg-[#12151a] text-white">Published</option>
              <option value="archived" className="bg-[#12151a] text-white">Archived</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={fieldLabel}>
              <span className={fieldName}>Year</span>
              <input
                className={fieldInput}
                name="year"
                defaultValue={
                  project?.year ||
                  new Date().getFullYear()
                }
              />
            </label>

            <label className={fieldLabel}>
              <span className={fieldName}>Order</span>
              <input
                className={fieldInput}
                name="sortOrder"
                type="number"
                defaultValue={project?.sortOrder ?? 999}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 border-b border-white/10 py-4 text-[10px] text-white/55">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? true}
            />
            Featured on homepage
          </label>

          <p className="mt-8 font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/30">
            Visual
          </p>

          <label className={fieldLabel}>
            <span className={fieldName}>Presentation</span>
            <select
              className={selectInput}
              style={{ colorScheme: "dark" }}
              name="visual"
              defaultValue={project?.visual || "architecture"}
            >
              <option value="gallery" className="bg-[#12151a] text-white">Product gallery</option>
              <option value="architecture" className="bg-[#12151a] text-white">Architecture</option>
              <option value="screenshot" className="bg-[#12151a] text-white">Screenshot</option>
            </select>
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Visual label</span>
            <input
              className={fieldInput}
              name="visualLabel"
              defaultValue={project?.visualLabel}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Cover image URL</span>
            <input
              className={fieldInput}
              name="coverImage"
              defaultValue={project?.coverImage}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>
              Gallery · Label | URL | Alt | Description
            </span>
            <textarea
              className={`${fieldInput} min-h-28 resize-y font-[var(--font-mono)] text-[9px] leading-5`}
              name="gallery"
              defaultValue={galleryText(project)}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>
              Architecture · Label | Description
            </span>
            <textarea
              className={`${fieldInput} min-h-32 resize-y font-[var(--font-mono)] text-[9px] leading-5`}
              name="architecture"
              defaultValue={architectureText(project)}
            />
          </label>

          <button
            type="submit"
            className="mt-6 min-h-11 w-full bg-[#eef0f1] px-5 text-[10px] font-bold text-[#111]"
          >
            {project
              ? "Save changes"
              : "Create project"}
          </button>
        </div>
      </aside>
    </form>
  );
}