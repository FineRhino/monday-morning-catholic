-- Adds "My notes" to a Supabase project set up before November 2026.
-- Run once in the Supabase SQL editor (Database > SQL Editor > New query).
-- New projects don't need this: schema.sql already includes it.

create table public.journal_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index journal_notes_user_id_idx on public.journal_notes (user_id);

alter table public.journal_notes enable row level security;
create policy "Own rows only" on public.journal_notes for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.journal_notes from anon;
grant select, insert, update, delete on public.journal_notes to authenticated;
