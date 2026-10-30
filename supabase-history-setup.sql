-- Cross-device visit history for the birthday site.
-- Setup:
-- 1. Run this in the Supabase SQL Editor.
-- 2. Create the site administrator under Authentication > Users.
-- 3. Replace the email in the final query with that account's email and run it.
-- 4. Do not put a Supabase secret/service-role key in the website.

create table if not exists public.website_visits (
    id uuid primary key,
    name text not null check (char_length(name) between 1 and 60),
    visited_at timestamptz not null default now(),
    duration_ms bigint not null default 0 check (duration_ms between 0 and 2592000000),
    visit_token uuid not null,
    photo_path text unique,
    created_at timestamptz not null default now()
);

alter table public.website_visits enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on public.website_visits from public, anon, authenticated;
grant insert (id, name, visit_token) on public.website_visits to anon;
grant select, delete on public.website_visits to authenticated;

drop policy if exists "Visitors can submit visit details" on public.website_visits;
create policy "Visitors can submit visit details"
    on public.website_visits for insert to anon
    with check (duration_ms = 0 and photo_path is null);

create table if not exists public.visit_history_admins (
    user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.visit_history_admins enable row level security;
revoke all on public.visit_history_admins from public, anon, authenticated;

create or replace function public.is_visit_history_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.visit_history_admins
        where user_id = (select auth.uid())
    );
$$;
revoke all on function public.is_visit_history_admin() from public, anon;
grant execute on function public.is_visit_history_admin() to authenticated;

drop policy if exists "Visit history admins can read visits" on public.website_visits;
create policy "Visit history admins can read visits"
    on public.website_visits for select to authenticated
    using ((select public.is_visit_history_admin()));

drop policy if exists "Visit history admins can delete visits" on public.website_visits;
create policy "Visit history admins can delete visits"
    on public.website_visits for delete to authenticated
    using ((select public.is_visit_history_admin()));

create or replace function public.update_visit_duration(
    p_visit_id uuid,
    p_visit_token uuid,
    p_duration_ms bigint
)
returns void
language sql
security definer
set search_path = ''
as $$
    update public.website_visits
    set duration_ms = greatest(0, least(p_duration_ms, 2592000000))
    where id = p_visit_id and visit_token = p_visit_token;
$$;
revoke all on function public.update_visit_duration(uuid, uuid, bigint) from public;
grant execute on function public.update_visit_duration(uuid, uuid, bigint) to anon, authenticated;

create or replace function public.attach_visit_photo(
    p_visit_id uuid,
    p_visit_token uuid
)
returns void
language sql
security definer
set search_path = ''
as $$
    update public.website_visits
    set photo_path = id::text || '.jpg'
    where id = p_visit_id and visit_token = p_visit_token and photo_path is null;
$$;
revoke all on function public.attach_visit_photo(uuid, uuid) from public;
grant execute on function public.attach_visit_photo(uuid, uuid) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('visit-photos', 'visit-photos', false, 2000000, array['image/jpeg'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

grant usage on schema storage to anon, authenticated;
grant insert on storage.objects to anon;
grant select, delete on storage.objects to authenticated;

drop policy if exists "Visitors can upload visit photos" on storage.objects;
create policy "Visitors can upload visit photos"
    on storage.objects for insert to anon
    with check (
        bucket_id = 'visit-photos'
        and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$'
        and metadata->>'mimetype' = 'image/jpeg'
    );

drop policy if exists "Visit history admins can read visit photos" on storage.objects;
create policy "Visit history admins can read visit photos"
    on storage.objects for select to authenticated
    using (bucket_id = 'visit-photos' and (select public.is_visit_history_admin()));

drop policy if exists "Visit history admins can delete visit photos" on storage.objects;
create policy "Visit history admins can delete visit photos"
    on storage.objects for delete to authenticated
    using (bucket_id = 'visit-photos' and (select public.is_visit_history_admin()));

-- After creating the administrator in Authentication > Users, replace the
-- email below with that account's email and run:
-- insert into public.visit_history_admins (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;

notify pgrst, 'reload schema';
