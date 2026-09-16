import { projects as fallbackProjects, type Project } from "@/data/projects";
import { siteConfig, type SiteSettings } from "@/data/site";
import { dbSelect, hasSupabase } from "./supabase-rest";

type DbProject = {
  id: string;
  slug: string;
  title: string;
  type: string;
  summary: string;
  result: string;
  year: string;
  role: string | null;
  stack: string[] | null;
  visual: Project["visual"];
  visual_label: string | null;
  cover_image: string | null;
  gallery: Project["gallery"] | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  status: "draft" | "published" | "archived";
  sort_order: number;
  architecture: Project["architecture"] | null;
  case_study: Project["caseStudy"];
};

function fallbackProject(slug: string) {
  return fallbackProjects.find((project) => project.slug === slug);
}

function liveUrlFallback(slug: string) {
  return fallbackProject(slug)?.liveUrl?.trim() || undefined;
}

function githubUrlFallback(slug: string) {
  return fallbackProject(slug)?.githubUrl?.trim() || undefined;
}

function mapProject(row: DbProject): Project {
  const fallback = fallbackProject(row.slug);
  const rawDbGallery = row.gallery?.length ? row.gallery : undefined;
  const staleAverlenMedia = row.slug === "averlen" && (
    row.cover_image?.trim() === "/projects/averlen-analytics.png" ||
    rawDbGallery?.every((item) => item.image === "/projects/averlen-analytics.png")
  );
  const dbGallery = staleAverlenMedia ? undefined : rawDbGallery;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    summary: row.summary,
    result: row.result,
    year: row.year,
    role: row.role || undefined,
    stack: row.stack || [],
    visual: row.visual,
    visualLabel: row.visual_label || undefined,
    // Preserve admin media when present, but do not let an older NULL database row
    // erase media that exists in the checked-in project definition.
    coverImage: staleAverlenMedia
      ? (fallback?.coverImage || fallback?.gallery?.[0]?.image)
      : (row.cover_image?.trim() || dbGallery?.[0]?.image || fallback?.coverImage || fallback?.gallery?.[0]?.image),
    gallery: dbGallery || fallback?.gallery || undefined,
    // Database values win, but seeded/older rows may still have NULL URLs.
    // Fall back to the public project configuration so known links remain visible.
    githubUrl: row.github_url?.trim() || githubUrlFallback(row.slug),
    liveUrl: row.live_url?.trim() || liveUrlFallback(row.slug),
    featured: row.featured,
    status: row.status,
    sortOrder: row.sort_order,
    architecture: row.architecture || undefined,
    caseStudy: row.case_study,
  };
}

const hiddenPublicProjectSlugs = new Set(["pr-review-agent"]);

export async function getPublishedProjects(): Promise<Project[]> {
  if (!hasSupabase()) {
    return [...fallbackProjects]
      .filter((project) => project.status === "published" && !hiddenPublicProjectSlugs.has(project.slug))
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  }
  try {
    const rows = await dbSelect<DbProject>(
      "projects",
      "select=*&status=eq.published&order=sort_order.asc",
    );
    const mapped = rows.length ? rows.map(mapProject) : fallbackProjects;
    return mapped.filter((project) => !hiddenPublicProjectSlugs.has(project.slug));
  } catch {
    return fallbackProjects
      .filter((project) => project.status === "published" && !hiddenPublicProjectSlugs.has(project.slug))
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (hiddenPublicProjectSlugs.has(slug)) return undefined;
  if (!hasSupabase()) return fallbackProjects.find((project) => project.slug === slug && project.status === "published");
  try {
    const rows = await dbSelect<DbProject>(
      "projects",
      `select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
    );
    return rows[0] ? mapProject(rows[0]) : fallbackProjects.find((project) => project.slug === slug && project.status === "published");
  } catch {
    return fallbackProjects.find((project) => project.slug === slug && project.status === "published");
  }
}

export async function getAllProjectsForAdmin(): Promise<Project[]> {
  if (!hasSupabase()) return fallbackProjects;
  const rows = await dbSelect<DbProject>("projects", "select=*&order=sort_order.asc");
  return rows.map(mapProject);
}

type SettingsRow = { id: string; data: Partial<SiteSettings> };

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSupabase()) return siteConfig;
  try {
    const rows = await dbSelect<SettingsRow>("site_settings", "select=*&id=eq.site&limit=1");
    return { ...siteConfig, ...(rows[0]?.data || {}) };
  } catch {
    return siteConfig;
  }
}
