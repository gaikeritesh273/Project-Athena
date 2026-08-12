-- Supabase schema for ATHENA
-- Fix: `CREATE VIEW IF NOT EXISTS` is not supported in Postgres, so we DROP the view if it exists then CREATE it.

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Profiles table: `id` should match Supabase Auth user id when inserting from server
create table if not exists profiles (
  id uuid primary key,
  email text,
  full_name text,
  phone text,
  date_of_birth date,
  literacy_score int default 0,
  badges jsonb default '[]'::jsonb,
  investigations_count int default 0,
  created_at timestamptz default now()
);

-- Quiz results
create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  score int,
  total int,
  badge_earned text,
  answers jsonb,
  created_at timestamptz default now()
);

-- Leaderboard view: drop if exists, then create
drop view if exists leaderboard;
create view leaderboard as
select
  p.id,
  p.full_name,
  p.email,
  p.literacy_score,
  p.investigations_count as claims_checked,
  coalesce((select count(*) from quiz_results qr where qr.user_id = p.id), 0) as quizzes_taken,
  coalesce((select max(score) from quiz_results qr where qr.user_id = p.id), 0) as best_quiz_score
from profiles p;

-- End of schema
