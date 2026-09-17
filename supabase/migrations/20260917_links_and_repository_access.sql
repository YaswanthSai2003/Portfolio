-- Repository visibility + link cleanup for the portfolio CMS.
-- Safe to run on an existing database.

alter table public.projects
add column if not exists repository_visibility text
not null
default 'none';

do $$
begin
  alter table public.projects
  add constraint projects_repository_visibility_check
  check (
    repository_visibility in (
      'public',
      'private',
      'none'
    )
  );
exception
  when duplicate_object then null;
end $$;

-- Existing projects that already have a GitHub URL remain public by default.
update public.projects
set repository_visibility = 'public'
where
  github_url is not null
  and trim(github_url) <> ''
  and repository_visibility = 'none';

-- Averlen source is private; only its live product link should be public.
update public.projects
set
  repository_visibility = 'private',
  github_url = null
where slug = 'averlen';

-- The resume is now controlled exclusively by resume_versions.is_active.
-- Remove the legacy manual resume URL from the site settings JSON if present.
update public.site_settings
set
  data = data - 'resumeUrl',
  updated_at = now()
where id = 'site';
