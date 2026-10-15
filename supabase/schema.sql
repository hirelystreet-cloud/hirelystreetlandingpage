create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('customer', 'provider')),
  full_name text not null,
  email text not null,
  city text not null,
  interests text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_type_email_key
  on public.waitlist (type, email);

alter table public.waitlist enable row level security;
revoke all on table public.waitlist from anon, authenticated;
grant all on table public.waitlist to service_role;
