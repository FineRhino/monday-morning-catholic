-- Monday Morning Catholic: personal data for signed-in visitors.
-- Run this once in the Supabase SQL editor (Database > SQL Editor > New query).
--
-- Every table has row level security, so each person can only read and change
-- their own rows. Deleting a user deletes all of their rows (on delete cascade).

-- People on a visitor's prayer list.
create table public.prayer_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  intention text check (char_length(intention) <= 140),
  prayed_on date,
  created_at timestamptz not null default now()
);
create index prayer_list_user_id_idx on public.prayer_list (user_id);

-- Prayers a visitor has saved, by id from src/data/prayers.ts.
create table public.saved_prayers (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  prayer_id text not null check (char_length(prayer_id) <= 60),
  created_at timestamptz not null default now(),
  primary key (user_id, prayer_id)
);

-- Saved Scripture passages, with the looked-up text and the visitor's note.
create table public.passages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  ref text not null check (char_length(ref) between 1 and 60),
  text text check (char_length(text) <= 50000),
  note text check (char_length(note) <= 200),
  saved_at timestamptz not null default now(),
  unique (user_id, ref)
);

-- Steps of "Today's rhythm" checked off on a given day.
create table public.rhythm_steps (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day date not null,
  step text not null check (char_length(step) <= 40),
  primary key (user_id, day, step)
);

-- Row level security: signed-in visitors see and change only their own rows.
-- Signed-out visitors (the anon role) get nothing.
alter table public.prayer_list enable row level security;
alter table public.saved_prayers enable row level security;
alter table public.passages enable row level security;
alter table public.rhythm_steps enable row level security;

create policy "Own rows only" on public.prayer_list for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own rows only" on public.saved_prayers for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own rows only" on public.passages for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own rows only" on public.rhythm_steps for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.prayer_list, public.saved_prayers, public.passages, public.rhythm_steps from anon;
grant select, insert, update, delete on public.prayer_list, public.saved_prayers, public.passages, public.rhythm_steps to authenticated;

-- Lets a signed-in visitor delete their own account. Their rows go with it.
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
