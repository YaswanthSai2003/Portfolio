import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <>
      <AdminPageHeader eyebrow="PROJECTS / NEW" title="New project" description="Create content as a draft first. Publishing makes it eligible for the public portfolio." action={<Link href="/admin/projects" className="text-[10px] text-white/50">← Projects</Link>} />
      <ProjectForm />
    </>
  );
}
