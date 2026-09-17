-- Portfolio CMS schema for Supabase/PostgreSQL.
-- This file is the baseline schema for a fresh Supabase project.
--
-- IMPORTANT:
-- - The running application does not execute this file at runtime.
-- - For an existing Supabase project, prefer migrations / ALTER statements.
-- - Keep this file updated so a fresh environment can be created from the
--   current application structure.

create extension if not exists pgcrypto;


-- =========================================================
-- PROJECTS
-- =========================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type text not null,
  summary text not null,
  result text not null default '',
  year text not null,
  role text,
  stack jsonb not null default '[]'::jsonb,

  visual text not null default 'architecture'
    check (visual in ('gallery', 'architecture', 'screenshot')),

  visual_label text,
  cover_image text,
  gallery jsonb,

  github_url text,
  live_url text,

  repository_visibility text not null default 'none'
    check (
      repository_visibility in (
        'public',
        'private',
        'none'
      )
    ),

  featured boolean not null default true,

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'published',
        'archived'
      )
    ),

  sort_order integer not null default 999,
  architecture jsonb,

  case_study jsonb not null default
    '{"overview":"","problem":"","approach":"","engineering":[]}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibility for databases created from an older schema.
alter table public.projects
add column if not exists repository_visibility text;

update public.projects
set repository_visibility =
  case
    when github_url is not null
      and trim(github_url) <> ''
      then 'public'
    else 'none'
  end
where repository_visibility is null;

alter table public.projects
alter column repository_visibility
set default 'none';

alter table public.projects
alter column repository_visibility
set not null;

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

create index if not exists projects_public_order_idx
on public.projects (
  status,
  featured,
  sort_order
);


-- =========================================================
-- SITE SETTINGS
-- =========================================================

create table if not exists public.site_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);


-- =========================================================
-- RESUME VERSIONS
-- =========================================================

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  storage_path text not null unique,
  file_name text not null,
  file_size bigint not null,
  is_active boolean not null default false,
  uploaded_at timestamptz not null default now(),
  activated_at timestamptz
);

create unique index if not exists only_one_active_resume
on public.resume_versions ((is_active))
where is_active = true;


-- =========================================================
-- CONTACT EMAIL VERIFICATION
-- =========================================================

create table if not exists public.contact_email_verifications (
  id uuid primary key,
  email text not null,
  code_hash text not null,

  attempts integer not null default 0
    check (
      attempts >= 0
      and attempts <= 20
    ),

  ip_hash text,
  expires_at timestamptz not null,
  verified_at timestamptz,
  used_at timestamptz,

  fallback_allowed_at timestamptz,
  fallback_reason text,

  created_at timestamptz not null default now()
);

alter table public.contact_email_verifications
add column if not exists fallback_allowed_at timestamptz;

alter table public.contact_email_verifications
add column if not exists fallback_reason text;

create index if not exists
contact_email_verifications_email_created_idx
on public.contact_email_verifications (
  email,
  created_at desc
);

create index if not exists
contact_email_verifications_ip_created_idx
on public.contact_email_verifications (
  ip_hash,
  created_at desc
);


-- =========================================================
-- CONTACT MESSAGES
-- =========================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  type text not null,
  name text not null,
  email text not null,
  company text,
  message text not null,

  status text not null default 'new'
    check (
      status in (
        'new',
        'read',
        'replied',
        'archived'
      )
    ),

  verification_id uuid,
  email_verified boolean not null default false,
  delivery_mode text not null default 'legacy',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibility for databases created from an older schema.
alter table public.contact_messages
add column if not exists verification_id uuid;

alter table public.contact_messages
add column if not exists email_verified boolean
not null default false;

alter table public.contact_messages
add column if not exists delivery_mode text
not null default 'legacy';

create unique index if not exists
contact_messages_verification_id_unique
on public.contact_messages (verification_id)
where verification_id is not null;

do $$
begin
  alter table public.contact_messages
  add constraint contact_messages_verification_id_fkey
  foreign key (verification_id)
  references public.contact_email_verifications(id)
  on delete set null;
exception
  when duplicate_object then null;
end $$;

create index if not exists contact_messages_created_idx
on public.contact_messages (
  created_at desc
);


-- =========================================================
-- ANALYTICS
-- =========================================================

create table if not exists public.analytics_events (
  id bigint generated by default as identity primary key,
  session_id text not null,
  event_type text not null,
  path text,
  project_slug text,
  referrer text,
  user_agent text,
  device_class text,
  browser text,
  os text,
  country text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_idx
on public.analytics_events (
  created_at desc
);

create index if not exists analytics_events_session_idx
on public.analytics_events (
  session_id
);

create index if not exists analytics_events_type_idx
on public.analytics_events (
  event_type
);


-- =========================================================
-- MEDIA
-- =========================================================

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  public_url text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);


-- =========================================================
-- AUDIT LOGS
-- =========================================================

create table if not exists public.audit_logs (
  id bigint generated by default as identity primary key,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx
on public.audit_logs (
  created_at desc
);


-- =========================================================
-- DEFAULT SITE SETTINGS
-- =========================================================
--
-- Public profile links are intentionally blank here.
-- Configure them through Admin -> Settings.
--
-- Resume URL is intentionally NOT stored here.
-- The active resume comes from public.resume_versions.

insert into public.site_settings (
  id,
  data
)
values (
  'site',
  '{
    "fullName": "Yaswanth Sai Reddy Kadhati",
    "brandName": "YK",
    "role": "Software Engineer · Backend · Full-Stack · AI",
    "heroTitle": "I build software from idea to production.",
    "heroIntro": "Full-stack products, backend systems, AI-assisted developer tooling and applied machine learning — built with product judgement and production-minded engineering.",
    "availability": "Open to software engineering opportunities",

    "githubUrl": "",
    "linkedinUrl": "",
    "email": "",

    "contactMode": "form",
    "contactRequireVerification": true,
    "contactNotifyByEmail": false,

    "contactHeadline": "Have a role,\nproject or idea?",
    "contactFormNote": "Send a message here. If it''s a good fit, I''ll get back to you using the email you provide.",
    "contactDirectNote": "For hiring, collaboration or project enquiries, email or LinkedIn is the fastest way to reach me.",
    "contactClosedNote": "I''m not taking new enquiries at the moment, but you can still explore my work and follow along through my public profiles."
  }'::jsonb
)
on conflict (id) do nothing;


-- =========================================================
-- PROJECT SEED DATA
-- =========================================================
--
-- Links are intentionally NOT hardcoded here.
--
-- github_url / live_url / repository_visibility should normally be
-- configured through Admin -> Projects.
--
-- Existing rows are never overwritten by this seed.

insert into public.projects (
  slug,
  title,
  type,
  summary,
  result,
  year,
  role,
  stack,
  visual,
  visual_label,
  cover_image,
  gallery,
  github_url,
  live_url,
  repository_visibility,
  featured,
  status,
  sort_order,
  architecture,
  case_study
)
values

(
  'averlen',
  'Averlen',
  'Product engineering',
  'Revenue intelligence for hospitality teams — from booking ingestion to analytics, pricing workflows and AI-assisted insights.',
  'Designed and built the product end to end across multi-tenant data, analytics, access control, caching, pricing and AI workflows.',
  '2026',
  'Product design · Full-stack engineering',
  '["React","TypeScript","FastAPI","PostgreSQL","Redis","Docker"]'::jsonb,
  'gallery',
  'Revenue analytics',
  '/projects/averlen-overview-2026.png',
  '[
    {
      "label":"Overview",
      "description":"Revenue overview across the demo portfolio with bookings, average value, booked nights and city performance.",
      "image":"/projects/averlen-overview-2026.png",
      "alt":"Averlen revenue overview dashboard"
    },
    {
      "label":"Pricing",
      "description":"Portfolio-level pricing workspace for comparing booking signals and explainable recommendations.",
      "image":"/projects/averlen-pricing-2026.png",
      "alt":"Averlen pricing dashboard"
    },
    {
      "label":"Analytics",
      "description":"Revenue analytics with configurable ranges, performance views and trend visualisation.",
      "image":"/projects/averlen-analytics-2026.png",
      "alt":"Averlen analytics dashboard"
    }
  ]'::jsonb,
  null,
  null,
  'private',
  true,
  'published',
  1,
  null,
  '{
    "overview":"Averlen is a multi-tenant revenue intelligence product for hospitality teams. It brings data ingestion, analytics, pricing workflows and AI-assisted insight into one system.",
    "problem":"Revenue and operating data is often fragmented across spreadsheets and tools, making it difficult to understand performance quickly or make consistent pricing decisions.",
    "approach":"I designed the product around a secure multi-tenant backend, structured ingestion jobs, analytics APIs, pricing workflows and a frontend that keeps the most important decisions close to the data.",
    "engineering":[
      "Multi-tenant organization isolation",
      "JWT authentication and role-based access",
      "CSV preview, mapping and ingestion jobs",
      "Revenue, occupancy and property analytics",
      "Redis caching and production readiness",
      "Pricing recommendations and AI-assisted insights"
    ],
    "decisions":[
      {
        "title":"Separate preview from mutation",
        "copy":"Pricing previews are read-only. Generating or saving a recommendation is a separate operation, so exploration never creates history accidentally."
      },
      {
        "title":"Enforce tenant boundaries in the backend",
        "copy":"Organization scope is applied at the service/API boundary instead of relying on frontend filtering."
      }
    ]
  }'::jsonb
),

(
  'pr-review-agent',
  'PR Review Agent',
  'AI engineering',
  'An automated pull-request review system designed to keep feedback valid even when the branch changes during analysis.',
  'Combines deterministic checks, specialist review workers and a final validator before publishing comments back to the pull request.',
  '2026',
  'System design · AI engineering',
  '["Python","FastAPI","Claude","GitHub","Pytest"]'::jsonb,
  'architecture',
  'Review workflow',
  null,
  null,
  null,
  null,
  'none',
  false,
  'archived',
  99,
  '{
    "eyebrow":"PULL REQUEST / REVIEW PIPELINE",
    "nodes":[
      {"label":"Pull request","description":"New or updated code"},
      {"label":"Revision snapshot","description":"Pin the exact revision"},
      {"label":"Review workers","description":"Security · correctness · tests · maintainability"},
      {"label":"Validator","description":"Reject weak, duplicate or stale findings"},
      {"label":"Publish","description":"Feedback valid for current code"}
    ]
  }'::jsonb,
  '{
    "overview":"A review agent designed around a production problem: pull requests can change while automated analysis is still running.",
    "problem":"If another commit lands mid-review, generated comments can point at code that moved, was renamed or no longer exists.",
    "approach":"The workflow snapshots the revision, runs specialist workers, validates the combined findings and checks the branch again before feedback is published.",
    "engineering":[
      "Four specialist review workers plus a validator",
      "Revision tracking and stale-comment handling",
      "Deterministic checks before model reasoning",
      "Structured outputs and schema validation",
      "Evaluation cases for production-style failures"
    ],
    "decisions":[
      {
        "title":"Deterministic checks first",
        "copy":"Facts that can be established with static checks should not depend on model interpretation. The model is reserved for reasoning-heavy review work."
      },
      {
        "title":"Validate before publishing",
        "copy":"A final validator removes duplicate, unsupported or stale findings before anything reaches the pull request."
      }
    ]
  }'::jsonb
),

(
  'object-detection',
  'Object Detection',
  'Applied machine learning',
  'A computer-vision workflow using Faster R-CNN for object localisation, classification and detection evaluation.',
  'Covers dataset preparation, model training, bounding-box inference and mean average precision evaluation.',
  '2026',
  'Model training · Evaluation',
  '["PyTorch","Faster R-CNN","TorchMetrics","Python"]'::jsonb,
  'architecture',
  'ML pipeline',
  null,
  null,
  null,
  null,
  'none',
  false,
  'published',
  4,
  '{
    "eyebrow":"COMPUTER VISION / MODEL PIPELINE",
    "nodes":[
      {"label":"Dataset","description":"Images + labelled boxes"},
      {"label":"Preprocess","description":"Training-ready samples"},
      {"label":"Faster R-CNN","description":"Detection model"},
      {"label":"Inference","description":"Classes + bounding boxes"},
      {"label":"mAP","description":"Detection evaluation"}
    ]
  }'::jsonb,
  '{
    "overview":"An applied computer-vision project focused on the complete object-detection workflow rather than only running inference.",
    "problem":"Object detection has to identify both what an object is and where it appears, which requires different targets and evaluation from simple image classification.",
    "approach":"I prepared detection data, trained Faster R-CNN, visualised predictions and evaluated model quality using detection metrics such as mean average precision.",
    "engineering":[
      "Detection dataset preparation",
      "Faster R-CNN training",
      "Bounding-box inference",
      "Confidence filtering and visualisation",
      "TorchMetrics evaluation"
    ]
  }'::jsonb
),

(
  'reading-platform',
  'Reading Platform',
  'Backend platform',
  'A backend-first reading platform with accounts, reading lists, reviews and administrative workflows.',
  'Combines secure authentication, permissions, pagination, rate limiting and user-content rules in a structured REST API.',
  '2026',
  'API design · Security · Data modelling',
  '["Node.js","Express","PostgreSQL","Redis","JWT"]'::jsonb,
  'architecture',
  'Backend architecture',
  null,
  null,
  null,
  null,
  'none',
  true,
  'published',
  2,
  '{
    "eyebrow":"BACKEND / APPLICATION FLOW",
    "nodes":[
      {"label":"Client","description":"Books, lists and reviews"},
      {"label":"REST API","description":"Application workflows"},
      {"label":"Auth + RBAC","description":"Identity and permissions"},
      {"label":"PostgreSQL","description":"Primary relational data"},
      {"label":"Redis","description":"Token and cache workflows"}
    ]
  }'::jsonb,
  '{
    "overview":"A reading platform built around secure account and content-management workflows.",
    "problem":"A reading-list application becomes significantly more complex once authentication, permissions, reviews, pagination and account security are introduced.",
    "approach":"The platform separates admin and user responsibilities while keeping authentication, refresh tokens, reading lists and review workflows cleanly separated in the API.",
    "engineering":[
      "JWT access and refresh flow",
      "Role-based permissions",
      "Server-side pagination",
      "Authentication rate limiting",
      "Reading-list and review constraints",
      "Password reset workflow"
    ]
  }'::jsonb
),

(
  'compliance-tracker',
  'Compliance Tracker',
  'Full-stack application',
  'A responsive compliance workspace for clients, tasks, deadlines, filtering and lightweight analytics.',
  'Built the end-to-end task workflow with a React frontend and Node/Express API, then deployed it as a production web app.',
  '2026',
  'Product engineering',
  '["React","Node.js","Express","PostgreSQL","Prisma","Recharts"]'::jsonb,
  'architecture',
  null,
  null,
  null,
  null,
  null,
  'none',
  true,
  'published',
  3,
  null,
  '{
    "overview":"A compact full-stack compliance tracker built around client work, task status, deadlines and responsive day-to-day usage.",
    "problem":"Compliance work becomes difficult to scan once tasks are spread across clients and due dates without a clear view of priority and status.",
    "approach":"I built a responsive client/task workflow with filters, CRUD actions, overdue states and analytics, backed by a Node/Express API.",
    "engineering":[
      "Responsive React UI",
      "Task CRUD",
      "Filtering and search",
      "Analytics",
      "Deployment"
    ]
  }'::jsonb
),

(
  'finance-dashboard',
  'Finance Dashboard',
  'Frontend product UI',
  'An executive-style finance workspace for overview metrics, transactions, insights and role-aware views.',
  'Built a polished responsive interface with state management and data visualisation for a finance-oriented product brief.',
  '2026',
  'Frontend engineering',
  '["React","Vite","Tailwind","Recharts","Zustand"]'::jsonb,
  'screenshot',
  null,
  null,
  null,
  null,
  null,
  'none',
  false,
  'published',
  6,
  null,
  '{
    "overview":"A frontend-focused finance dashboard designed around hierarchy, responsive layout and clear data visualisation.",
    "problem":"Financial interfaces can become dense quickly, so the challenge was to keep key metrics, transactions and insights readable without flattening the information hierarchy.",
    "approach":"I structured the experience around a clear overview, transaction detail, financial insights and role-aware interactions, using reusable React components and lightweight state management.",
    "engineering":[
      "Responsive layout",
      "Reusable UI components",
      "Zustand state",
      "Recharts visualisation",
      "Role-aware views"
    ]
  }'::jsonb
),

(
  'smart-bookmarks',
  'Smart Bookmarks',
  'Next.js application',
  'A private bookmark manager with Google OAuth, Supabase Row Level Security and real-time cross-tab updates.',
  'Built authentication, per-user data isolation and real-time bookmark synchronisation using Next.js and Supabase.',
  '2026',
  'Full-stack product engineering',
  '["Next.js","Supabase","PostgreSQL","OAuth","Realtime"]'::jsonb,
  'architecture',
  null,
  null,
  null,
  null,
  null,
  'none',
  false,
  'published',
  7,
  null,
  '{
    "overview":"A focused full-stack app for saving private bookmarks and keeping them synchronised across sessions.",
    "problem":"The interesting engineering work is not the bookmark form itself; it is authentication, data isolation and keeping UI state consistent when the same account is open in multiple tabs.",
    "approach":"I used Google OAuth, Supabase Row Level Security and realtime database subscriptions so each user sees only their own data and changes propagate without a page refresh.",
    "engineering":[
      "Google OAuth",
      "Row Level Security",
      "Realtime subscriptions",
      "Private per-user data",
      "Next.js App Router"
    ]
  }'::jsonb
)

on conflict (slug) do nothing;


-- =========================================================
-- SECURITY
-- =========================================================
--
-- The public website does not access these tables directly.
-- Server-side routes/actions use the Supabase service-role key.

alter table public.projects
enable row level security;

alter table public.site_settings
enable row level security;

alter table public.resume_versions
enable row level security;

alter table public.contact_email_verifications
enable row level security;

alter table public.contact_messages
enable row level security;

alter table public.analytics_events
enable row level security;

alter table public.media_assets
enable row level security;

alter table public.audit_logs
enable row level security;


-- =========================================================
-- STORAGE
-- =========================================================
--
-- Project images are public.
-- Resumes remain private and are served through server-side routes.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'portfolio-media',
    'portfolio-media',
    true,
    8388608,
    array[
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif'
    ]
  ),
  (
    'resumes',
    'resumes',
    false,
    5242880,
    array[
      'application/pdf'
    ]
  )
on conflict (id) do nothing;
