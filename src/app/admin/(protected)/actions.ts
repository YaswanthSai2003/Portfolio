"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { writeAudit } from "@/lib/audit";
import { hasValidSignature } from "@/lib/file-signature";
import {
  dbDelete,
  dbInsert,
  dbSelect,
  dbUpdate,
  uploadPrivateFile,
  uploadPublicFile,
} from "@/lib/supabase-rest";

function text(
  form: FormData,
  key: string,
  max = 5000,
) {
  const value = form.get(key);
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function architectureFrom(value: string) {
  const nodes = lines(value)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return {
        label: label.trim(),
        description:
          rest.join("|").trim() || undefined,
      };
    })
    .filter((node) => node.label);

  return nodes.length
    ? {
        eyebrow: "SYSTEM / FLOW",
        nodes,
      }
    : null;
}

function decisionsFrom(value: string) {
  return lines(value)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return {
        title: title.trim(),
        copy: rest.join("|").trim(),
      };
    })
    .filter(
      (item) =>
        item.title && item.copy,
    );
}

function galleryFrom(value: string) {
  const items = lines(value)
    .map((line) => {
      const [
        label,
        image,
        alt,
        ...rest
      ] = line
        .split("|")
        .map((part) => part.trim());

      return {
        label,
        image,
        alt:
          alt || `${label} preview`,
        description:
          rest.join(" | ") || undefined,
      };
    })
    .filter(
      (item) =>
        item.label && item.image,
    );

  return items.length
    ? items
    : null;
}

export async function saveProjectAction(
  form: FormData,
) {
  await requireAdmin();

  const id = text(
    form,
    "id",
    100,
  );

  const slug = text(
    form,
    "slug",
    120,
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9-]+/g,
      "-",
    )
    .replace(
      /^-|-$/g,
      "",
    );

  if (!slug) {
    throw new Error(
      "Project slug is required.",
    );
  }

  const rawRepositoryVisibility =
    text(
      form,
      "repositoryVisibility",
      20,
    );

  const repositoryVisibility:
    | "public"
    | "private"
    | "none" =
    rawRepositoryVisibility === "public" ||
    rawRepositoryVisibility === "private"
      ? rawRepositoryVisibility
      : "none";

  const enteredGithubUrl = text(
    form,
    "githubUrl",
    1000,
  );

  const enteredLiveUrl = text(
    form,
    "liveUrl",
    1000,
  );

  if (
    repositoryVisibility === "public" &&
    !enteredGithubUrl
  ) {
    throw new Error(
      "GitHub URL is required when repository access is Public.",
    );
  }

  const githubUrl =
    repositoryVisibility === "public"
      ? enteredGithubUrl
      : null;

  const payload = {
    slug,
    title: text(
      form,
      "title",
      140,
    ),
    type: text(
      form,
      "type",
      180,
    ),
    summary: text(
      form,
      "summary",
      1200,
    ),
    result: text(
      form,
      "result",
      1200,
    ),
    year: text(
      form,
      "year",
      10,
    ),
    role:
      text(
        form,
        "role",
        220,
      ) || null,
    stack: text(
      form,
      "stack",
      1200,
    )
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    visual:
      text(
        form,
        "visual",
        30,
      ) || "architecture",
    visual_label:
      text(
        form,
        "visualLabel",
        180,
      ) || null,
    cover_image:
      text(
        form,
        "coverImage",
        1000,
      ) || null,
    gallery: galleryFrom(
      text(
        form,
        "gallery",
        8000,
      ),
    ),
    repository_visibility:
      repositoryVisibility,
    github_url: githubUrl,
    live_url:
      enteredLiveUrl || null,
    featured:
      form.get("featured") === "on",
    status:
      text(
        form,
        "status",
        20,
      ) || "draft",
    sort_order: Number(
      text(
        form,
        "sortOrder",
        10,
      ) || "999",
    ),
    architecture: architectureFrom(
      text(
        form,
        "architecture",
        8000,
      ),
    ),
    case_study: {
      overview: text(
        form,
        "overview",
        3000,
      ),
      problem: text(
        form,
        "problem",
        5000,
      ),
      approach: text(
        form,
        "approach",
        5000,
      ),
      engineering: lines(
        text(
          form,
          "engineering",
          8000,
        ),
      ),
      decisions: decisionsFrom(
        text(
          form,
          "decisions",
          8000,
        ),
      ),
    },
    updated_at:
      new Date().toISOString(),
  };

  if (id) {
    await dbUpdate(
      "projects",
      `id=eq.${encodeURIComponent(id)}`,
      payload,
    );

    await writeAudit(
      "PROJECT_UPDATED",
      "project",
      id,
      {
        slug,
        status: payload.status,
        repositoryVisibility,
      },
    );
  } else {
    const rows =
      await dbInsert<{
        id: string;
      }>(
        "projects",
        {
          ...payload,
          created_at:
            new Date().toISOString(),
        },
      );

    await writeAudit(
      "PROJECT_CREATED",
      "project",
      rows[0]?.id,
      {
        slug,
        status: payload.status,
        repositoryVisibility,
      },
    );
  }

  revalidatePath("/");
  revalidatePath(
    "/projects/[slug]",
    "page",
  );
  revalidatePath(
    "/admin/projects",
  );

  redirect(
    "/admin/projects",
  );
}

export async function deleteProjectAction(
  form: FormData,
) {
  await requireAdmin();

  const id = text(
    form,
    "id",
    100,
  );

  if (!id) {
    return;
  }

  await dbDelete(
    "projects",
    `id=eq.${encodeURIComponent(id)}`,
  );

  await writeAudit(
    "PROJECT_DELETED",
    "project",
    id,
  );

  revalidatePath("/");
  revalidatePath(
    "/admin/projects",
  );
}

export async function updateMessageStatusAction(
  form: FormData,
) {
  await requireAdmin();

  const id = text(
    form,
    "id",
    100,
  );

  const status = text(
    form,
    "status",
    30,
  );

  if (
    !id ||
    ![
      "new",
      "read",
      "replied",
      "archived",
    ].includes(status)
  ) {
    return;
  }

  await dbUpdate(
    "contact_messages",
    `id=eq.${encodeURIComponent(id)}`,
    {
      status,
      updated_at:
        new Date().toISOString(),
    },
  );

  await writeAudit(
    "MESSAGE_STATUS_UPDATED",
    "message",
    id,
    { status },
  );

  revalidatePath(
    "/admin/inbox",
  );
}

export async function saveSettingsAction(
  form: FormData,
) {
  await requireAdmin();

  const requestedContactMode =
    text(
      form,
      "contactMode",
      20,
    );

  const contactMode = [
    "form",
    "direct",
    "closed",
  ].includes(requestedContactMode)
    ? requestedContactMode
    : "form";

  const contactRequireVerification =
    form.get(
      "contactRequireVerification",
    ) === "on";

  const contactNotifyByEmail =
    form.get(
      "contactNotifyByEmail",
    ) === "on";

  const existing =
    await dbSelect<{
      id: string;
      data: Record<
        string,
        unknown
      >;
    }>(
      "site_settings",
      "select=id,data&id=eq.site&limit=1",
    );

  const currentData =
    existing[0]?.data ?? {};

  const data = {
    ...currentData,

    fullName: text(
      form,
      "fullName",
      160,
    ),

    brandName: text(
      form,
      "brandName",
      40,
    ).toUpperCase(),

    role: text(
      form,
      "role",
      140,
    ),

    heroTitle: text(
      form,
      "heroTitle",
      220,
    ),

    heroIntro: text(
      form,
      "heroIntro",
      1200,
    ),

    availability: text(
      form,
      "availability",
      220,
    ),

    // Public profile links are stored in site_settings.data.
    // An empty string intentionally means "do not show this link".
    githubUrl: text(
      form,
      "githubUrl",
      1000,
    ),

    linkedinUrl: text(
      form,
      "linkedinUrl",
      1000,
    ),

    email: text(
      form,
      "email",
      220,
    ),

    contactMode,
    contactRequireVerification,
    contactNotifyByEmail,

    contactHeadline:
      text(
        form,
        "contactHeadline",
        260,
      ) ||
      "Have a role,\nproject or idea?",

    contactFormNote: text(
      form,
      "contactFormNote",
      1000,
    ),

    contactDirectNote: text(
      form,
      "contactDirectNote",
      1000,
    ),

    contactClosedNote: text(
      form,
      "contactClosedNote",
      1000,
    ),
  };

  // Remove the old manual resume fallback if it exists from an earlier build.
  // Resume availability now comes only from resume_versions.is_active.
  delete (
    data as Record<
      string,
      unknown
    >
  ).resumeUrl;

  const payload = {
    data,
    updated_at:
      new Date().toISOString(),
  };

  if (existing[0]) {
    const updated =
      await dbUpdate<{
        id: string;
      }>(
        "site_settings",
        "id=eq.site",
        payload,
      );

    if (!updated.length) {
      await dbInsert(
        "site_settings",
        {
          id: "site",
          ...payload,
        },
      );
    }
  } else {
    await dbInsert(
      "site_settings",
      {
        id: "site",
        ...payload,
      },
    );
  }

  await writeAudit(
    "SITE_SETTINGS_UPDATED",
    "site",
    "site",
    {
      contactMode,
      contactRequireVerification,
      contactNotifyByEmail,
    },
  );

  revalidatePath("/");
  revalidatePath(
    "/admin/settings",
  );

  redirect(
    "/admin/settings?saved=1",
  );
}

export async function uploadMediaAction(
  form: FormData,
) {
  await requireAdmin();

  const file = form.get("file");

  if (
    !(file instanceof File) ||
    !file.size
  ) {
    throw new Error(
      "Select a file.",
    );
  }

  if (
    file.size >
    8 * 1024 * 1024
  ) {
    throw new Error(
      "Media files must be 8 MB or smaller.",
    );
  }

  if (
    !file.type.startsWith(
      "image/",
    )
  ) {
    throw new Error(
      "Only image uploads are accepted here.",
    );
  }

  if (
    !(await hasValidSignature(
      file,
      file.type,
    ))
  ) {
    throw new Error(
      "This file's content doesn't match an image of that type.",
    );
  }

  const safe = file.name
    .toLowerCase()
    .replace(
      /[^a-z0-9._-]+/g,
      "-",
    );

  const path = `${new Date()
    .toISOString()
    .slice(0, 10)}/${randomUUID()}-${safe}`;

  const url =
    await uploadPublicFile(
      "portfolio-media",
      path,
      file,
    );

  await dbInsert(
    "media_assets",
    {
      file_name: file.name,
      storage_path: path,
      public_url: url,
      mime_type: file.type,
      size_bytes: file.size,
    },
  );

  await writeAudit(
    "MEDIA_UPLOADED",
    "media",
    undefined,
    {
      path,
      fileName: file.name,
    },
  );

  revalidatePath(
    "/admin/media",
  );
}

export async function uploadResumeAction(
  form: FormData,
) {
  await requireAdmin();

  const file = form.get("file");

  const label =
    text(
      form,
      "label",
      120,
    ) ||
    new Date()
      .toISOString()
      .slice(0, 10);

  if (
    !(file instanceof File) ||
    !file.size
  ) {
    throw new Error(
      "Select a PDF.",
    );
  }

  if (
    file.type !==
    "application/pdf"
  ) {
    throw new Error(
      "Resume must be a PDF.",
    );
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    throw new Error(
      "Resume must be 5 MB or smaller.",
    );
  }

  if (
    !(await hasValidSignature(
      file,
      "application/pdf",
    ))
  ) {
    throw new Error(
      "This file doesn't look like a valid PDF.",
    );
  }

  const path = `${new Date()
    .toISOString()
    .slice(0, 10)}/${randomUUID()}-resume.pdf`;

  await uploadPrivateFile(
    "resumes",
    path,
    file,
  );

  const rows =
    await dbInsert<{
      id: string;
    }>(
      "resume_versions",
      {
        label,
        storage_path: path,
        file_name: file.name,
        file_size: file.size,
        is_active: false,
      },
    );

  await writeAudit(
    "RESUME_UPLOADED",
    "resume",
    rows[0]?.id,
    { label },
  );

  revalidatePath(
    "/admin/resume",
  );
}

export async function activateResumeAction(
  form: FormData,
) {
  await requireAdmin();

  const id = text(
    form,
    "id",
    100,
  );

  if (!id) {
    return;
  }

  await dbUpdate(
    "resume_versions",
    "is_active=eq.true",
    {
      is_active: false,
    },
  );

  await dbUpdate(
    "resume_versions",
    `id=eq.${encodeURIComponent(id)}`,
    {
      is_active: true,
      activated_at:
        new Date().toISOString(),
    },
  );

  await writeAudit(
    "RESUME_ACTIVATED",
    "resume",
    id,
  );

  revalidatePath("/resume");
  revalidatePath(
    "/admin/resume",
  );
}

export async function moveProjectAction(
  form: FormData,
) {
  await requireAdmin();

  const id = text(
    form,
    "id",
    100,
  );

  const direction = text(
    form,
    "direction",
    10,
  );

  if (
    !id ||
    ![
      "up",
      "down",
    ].includes(direction)
  ) {
    return;
  }

  const rows =
    await dbSelect<{
      id: string;
      sort_order: number;
    }>(
      "projects",
      "select=id,sort_order&order=sort_order.asc",
    );

  const index =
    rows.findIndex(
      (row) =>
        row.id === id,
    );

  const swapIndex =
    direction === "up"
      ? index - 1
      : index + 1;

  if (
    index < 0 ||
    swapIndex < 0 ||
    swapIndex >= rows.length
  ) {
    return;
  }

  const current = rows[index];
  const other = rows[swapIndex];

  await dbUpdate(
    "projects",
    `id=eq.${encodeURIComponent(
      current.id,
    )}`,
    {
      sort_order:
        other.sort_order,
    },
  );

  await dbUpdate(
    "projects",
    `id=eq.${encodeURIComponent(
      other.id,
    )}`,
    {
      sort_order:
        current.sort_order,
    },
  );

  await writeAudit(
    "PROJECT_REORDERED",
    "project",
    id,
    { direction },
  );

  revalidatePath("/");
  revalidatePath(
    "/admin/projects",
  );
}
