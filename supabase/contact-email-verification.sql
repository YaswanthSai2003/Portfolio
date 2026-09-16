-- Contact email verification for
-- the public portfolio contact form.

create table if not exists
public.contact_email_verifications (
  id uuid primary key,

  email text not null,

  code_hash text not null,

  attempts integer
    not null
    default 0
    check (
      attempts >= 0
      and attempts <= 20
    ),

  ip_hash text,

  expires_at timestamptz
    not null,

  verified_at timestamptz,

  used_at timestamptz,

  created_at timestamptz
    not null
    default now()
);

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

alter table
public.contact_email_verifications
enable row level security;

alter table
public.contact_messages
add column if not exists
verification_id uuid;

create unique index if not exists
contact_messages_verification_id_unique
on public.contact_messages (
  verification_id
)
where verification_id
is not null;

do $$
begin

  alter table
  public.contact_messages

  add constraint
  contact_messages_verification_id_fkey

  foreign key (
    verification_id
  )

  references
  public.contact_email_verifications(id)

  on delete set null;

exception

  when duplicate_object then
    null;

end $$;