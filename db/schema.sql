-- Belltower Friends. Applied by `npm run db:migrate`; every statement is safe to re-run.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  apple_sub text unique not null,
  name text not null,
  sharing_paused boolean not null default false,
  created_at timestamptz not null default now()
);

-- Bearer tokens, stored as SHA-256 hashes so a database leak can't be replayed.
create table if not exists sessions (
  token_hash bytea primary key,
  user_id uuid not null references users on delete cascade,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);
create index if not exists sessions_user on sessions (user_id);

-- Apple refresh token, kept only so deleting an account can revoke Sign in with Apple without asking again.
alter table users add column if not exists apple_refresh_token text;

-- One row per person per term: the compact sections their app uploads.
create table if not exists schedules (
  user_id uuid not null references users on delete cascade,
  term text not null,
  sections jsonb not null,
  hash text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, term)
);

-- Mutual friendships, one row per pair with a < b.
create table if not exists friendships (
  a uuid not null references users on delete cascade,
  b uuid not null references users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (a, b),
  check (a < b)
);
create index if not exists friendships_b on friendships (b);

-- Invite links. Only the hash of the code is kept.
create table if not exists invites (
  code_hash bytea primary key,
  owner uuid not null references users on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  uses int not null default 0,
  revoked boolean not null default false
);
create index if not exists invites_owner on invites (owner);

-- Failed or repeated invite redemptions, for rate limiting.
create table if not exists invite_attempts (
  user_id uuid not null references users on delete cascade,
  at timestamptz not null default now()
);
create index if not exists invite_attempts_user on invite_attempts (user_id, at);

-- Widgets unlock for good once someone has a friend. Keyed by a hash of the Apple ID, not the user row, so it
-- outlives either side deleting their account (and comes back if they sign in again). Written once, never removed.
create table if not exists widget_unlocks (
  sub_hash bytea primary key,
  unlocked_at timestamptz not null default now()
);
insert into widget_unlocks (sub_hash)
  select sha256(convert_to(u.apple_sub, 'UTF8')) from users u
   where exists (select 1 from friendships f where f.a = u.id or f.b = u.id)
  on conflict do nothing;
