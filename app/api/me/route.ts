import { canRevoke, revokeAppleSignIn } from '../../../lib/server/apple';
import { cleanName, publicUser, requireUser, type User } from '../../../lib/server/auth';
import { one, query } from '../../../lib/server/db';
import { body, handle, HttpError, json } from '../../../lib/server/http';

export const GET = handle(async (req: Request) => json({ user: publicUser(await requireUser(req)), canRevoke: canRevoke() }));

/** Rename, or pause and resume sharing. */
export const PATCH = handle(async (req: Request) => {
  const me = await requireUser(req);
  const { name, sharingPaused } = await body<{ name?: unknown; sharingPaused?: unknown }>(req);
  const next = name === undefined ? me.name : cleanName(name);
  if (next === null) throw new HttpError(400, 'Name required');
  const paused = typeof sharingPaused === 'boolean' ? sharingPaused : me.sharing_paused;
  const user = await one<User>('update users set name = $2, sharing_paused = $3 where id = $1 returning id, name, sharing_paused', [
    me.id,
    next,
    paused,
  ]);
  return json({ user: publicUser(user!) });
});

/**
 * Deletes the account and everything tied to it (sessions, schedules, friendships, invites cascade), and revokes
 * Belltower's Sign in with Apple access with the token saved at sign-in.
 */
export const DELETE = handle(async (req: Request) => {
  const me = await requireUser(req);
  const stored = await one<{ apple_refresh_token: string | null }>('select apple_refresh_token from users where id = $1', [me.id]);
  const revoked = await revokeAppleSignIn(stored?.apple_refresh_token ?? null);
  await query('delete from users where id = $1', [me.id]);
  return json({ deleted: true, revoked });
});
