# ATHENA — Setup Guide

This guide walks you through creating the Supabase database, provisioning Upstash Redis, configuring environment variables, and running both Backend and Frontend locally.

## Prerequisites
- Node.js 18+ and npm (or pnpm/yarn)
- Python 3.10+ and pip
- Git
- A Supabase account (https://supabase.com)
- An Upstash account (https://upstash.com) for Redis (optional but recommended)

---

## 1) Supabase Project and Database

1. Create a new project in Supabase.
2. In the project settings -> API, copy the `Project URL` (SUPABASE_URL), the `anon` (public) key (use for frontend as `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and the `service_role` key (use for server `SUPABASE_SERVICE_ROLE_KEY`).
3. Enable Email signups: Authentication -> Settings -> Email auth (ensure signups are allowed).

### Create tables (SQL)
Open the Supabase SQL editor and execute the following SQL to create the tables and view used by the backend:

```sql
-- enable pgcrypto for uuid generation (if not already enabled)
create extension if not exists pgcrypto;

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

create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  score int,
  total int,
  badge_earned text,
  answers jsonb,
  created_at timestamptz default now()
);

create view if not exists leaderboard as
select
  p.id,
  p.full_name,
  p.email,
  p.literacy_score,
  p.investigations_count as claims_checked,
  coalesce((select count(*) from quiz_results qr where qr.user_id = p.id), 0) as quizzes_taken,
  coalesce((select max(score) from quiz_results qr where qr.user_id = p.id), 0) as best_quiz_score
from profiles p;
```

Notes:
- The backend expects `profiles` to have an `id` that matches the Supabase Auth user `id`. When a user signs up via the API, the code creates the auth user and then inserts a row in `profiles` using the auth user id.

---

## 2) Upstash Redis (REST)

1. Sign up at https://upstash.com and create a Redis database (choose the REST API option if prompted).
2. After creation, copy the `REST URL` and `REST token` (or password). They look like `https://<region>-...upstash.io` and a token string.
3. In `Backend/.env` you'll add these values as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

You can test the REST endpoint with curl (replace URL/TOKEN):

```bash
curl -s -X POST "https://<your-upstash-url>/set/mykey/\"{\"hello\":\"world\"}\"" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -G --data-urlencode "EX=60"

curl -s "https://<your-upstash-url>/get/mykey" -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 3) Environment files

Create environment files in the two project roots.

Backend: create `Backend/.env` (copy from `.env.example`) and fill values:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=<use anon or service key for server-safe operations (see below)>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_from_supabase>
UPSTASH_REDIS_REST_URL=https://<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-rest-token>
NEWSAPI_KEY=your-newsapi-key
GNEWS_KEY=your-gnews-key
JWT_SECRET=change-this-secret-in-production
CORS_ORIGINS=http://localhost:3000
```

Recommendations:
- For `SUPABASE_KEY` the backend's `get_supabase()` uses `SUPABASE_KEY` for the normal client; `get_supabase_admin()` uses `SUPABASE_SERVICE_ROLE_KEY`. Keep both in `.env`. Never commit `.env` to git.

Frontend: create `Frontend/.env.local` with only public keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

Restart both dev servers after changing env files so values are picked up.

---

## 4) Run Backend locally

Windows PowerShell (recommended):

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
# create .env (see above) or set env vars in your shell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Test health endpoint:

```bash
curl http://127.0.0.1:8000/health
```

If you prefer, use the built-in `if __name__ == '__main__'` entry in `app/main.py` or `python -m uvicorn app.main:app --reload`.

---

## 5) Run Frontend locally

From the repo root or `Frontend` folder:

```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:3000 and the frontend should connect to Supabase (auth) and the backend endpoints.

---

## 6) Quick end-to-end checks

1. Signup via the frontend `/signup` page. This should create a Supabase auth user and a `profiles` row (service role insert).
2. Login via frontend; confirm you receive tokens.
3. Use the `GET /quiz/leaderboard` endpoint to see leaderboard data (or demo data if DB not seeded).

---

## 7) Security & deployment notes
- Do NOT commit `.env` or `.env.local` to source control. Add them to `.gitignore`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret — it has elevated privileges.
- For production, store secrets in your hosting environment (Vercel/Azure/GCP/Netlify) not in repository files.

---

## 8) Troubleshooting
- If Supabase auth errors occur: confirm `SUPABASE_URL`, anon key, and service role key are correct and that auth settings allow email signups.
- If Redis caching isn't working: verify `UPSTASH_REDIS_REST_URL` and token, and test the REST curl commands above.
- If CORS errors: check `CORS_ORIGINS` in `Backend/.env` contains `http://localhost:3000`.

---

If you want, I can:
- Create `Backend/.env.template` and `Frontend/.env.local.example` in the repo (without secrets).
- Add a small script to seed demo profiles / quiz results.
