import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const projects = await getPublishedProjects();
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/resume`, lastModified: new Date() },
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: new Date() })),
  ];
}
