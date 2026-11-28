import { requireUser, sha256 } from '../../../lib/server/auth';
import { one, query } from '../../../lib/server/db';
import { handle, HttpError, json } from '../../../lib/server/http';
import { INVITE_DAYS, inviteUrl, newCode } from '../../../lib/server/invites';

/** A new invite link. Only the code's hash is stored, so the link can't be shown again later. */
export const POST = handle(async (req: Request) => {
  const me = await requireUser(req);
  if (!me.name) throw new HttpError(400, 'Name required');
  const recent = await one<{ n: number }>(
    `select count(*)::int as n from invites where owner = $1 and created_at > now() - interval '1 day'`,
    [me.id],
  );
  if ((recent?.n ?? 0) >= 30) throw new HttpError(429, 'Try again tomorrow');
  const code = newCode();
  const rows = await query<{ expires_at: string }>(
    `insert into invites (code_hash, owner, expires_at) values ($1, $2, now() + make_interval(days => $3)) returning expires_at`,
    [sha256(code), me.id, INVITE_DAYS],
  );
  return json({ code, url: inviteUrl(code), expiresAt: rows[0].expires_at });
});

/** Turns off every open invite link. */
export const DELETE = handle(async (req: Request) => {
  const me = await requireUser(req);
  await query('update invites set revoked = true where owner = $1 and not revoked', [me.id]);
  return json({ revoked: true });
});
