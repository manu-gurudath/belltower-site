import { createHash, randomBytes } from 'node:crypto';

import { one, query } from './db';
import { HttpError } from './http';

export type User = { id: string; name: string; sharing_paused: boolean; widgets_unlocked: boolean };

/** SQL for a `users u` row's permanent widget unlock (db/schema.sql, widget_unlocks). */
export const WIDGETS_UNLOCKED = `exists (select 1 from widget_unlocks w where w.sub_hash = sha256(convert_to(u.apple_sub, 'UTF8'))) as widgets_unlocked`;

export const sha256 = (value: string) => createHash('sha256').update(value).digest();

/** Sessions last 180 days from last use. */
const SESSION_DAYS = 180;

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  await query('insert into sessions (token_hash, user_id) values ($1, $2)', [sha256(token), userId]);
  // Tidy up this person's expired sessions while we're here.
  await query('delete from sessions where user_id = $1 and last_seen < now() - make_interval(days => $2)', [userId, SESSION_DAYS]);
  return token;
}

/** The signed-in user for a request's bearer token, or a 401. */
export async function requireUser(req: Request): Promise<User> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new HttpError(401, 'Sign in required');
  const user = await one<User>(
    `update sessions s set last_seen = now()
       from users u
      where s.token_hash = $1 and u.id = s.user_id and s.last_seen > now() - make_interval(days => $2)
      returning u.id, u.name, u.sharing_paused, ${WIDGETS_UNLOCKED}`,
    [sha256(token), SESSION_DAYS],
  );
  if (!user) throw new HttpError(401, 'Sign in required');
  return user;
}

export const publicUser = (u: User) => ({ id: u.id, name: u.name, sharingPaused: u.sharing_paused, widgetsUnlocked: u.widgets_unlocked });

/** A display name: trimmed, single-spaced, 1–40 characters. */
export function cleanName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.replace(/\s+/g, ' ').trim().slice(0, 40);
  return name.length > 0 ? name : null;
}
