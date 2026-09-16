import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getAllProjectsForAdmin } from "@/lib/content";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = (await getAllProjectsForAdmin()).find((item) => item.id === id);
  if (!project) notFound();
  return (
    <>
      <AdminPageHeader eyebrow="PROJECTS / EDIT" title={project.title} description="Update the public-facing content, project links, architecture and publishing state." action={<Link href="/admin/projects" className="text-[10px] text-white/50">← Projects</Link>} />
      <ProjectForm project={project} />
    </>
  );
}
