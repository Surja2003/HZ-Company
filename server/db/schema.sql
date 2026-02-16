-- HZ IT Company lead capture schema (Postgres)

create table if not exists contact_submissions (
  id bigserial primary key,
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  phone text null,
  subject text not null,
  message text not null,

  ip inet null,
  user_agent text null,
  referer text null
);

create table if not exists hire_us_submissions (
  id bigserial primary key,
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  phone text not null,
  company text null,

  services text[] not null,
  project_name text not null,
  project_description text not null,
  budget text not null,
  timeline text not null,
  reference_url text null,
  additional_notes text null,

  ip inet null,
  user_agent text null,
  referer text null
);

create index if not exists idx_contact_created_at on contact_submissions (created_at desc);
create index if not exists idx_hire_created_at on hire_us_submissions (created_at desc);
