import { requireUser, sha256 } from '../../../../../lib/server/auth';
import { one, query, transaction } from '../../../../../lib/server/db';
import { handle, HttpError, json } from '../../../../../lib/server/http';
import { CODE_LENGTH, INVITE_MAX_USES, normalizeCode } from '../../../../../lib/server/invites';

type Params = { params: Promise<{ code: string }> };

/** Accepting makes the friendship mutual: the sender shared the link, the invitee chose to join. */
export const POST = handle(async (req: Request, { params }: Params) => {
  const me = await requireUser(req);
  const code = normalizeCode((await params).code);

  // Ten tries an hour stops anyone guessing codes. Recording the try first means parallel requests all count.
  await query('insert into invite_attempts (user_id) values ($1)', [me.id]);
  const tries = await one<{ n: number }>(
    `select count(*)::int as n from invite_attempts where user_id = $1 and at > now() - interval '1 hour'`,
    [me.id],
  );
  if ((tries?.n ?? 0) > 10) throw new HttpError(429, 'Too many tries. Try again later.');
  if (code.length !== CODE_LENGTH) throw new HttpError(404, 'This invite has expired');

  return json(
    await transaction(async (q) => {
      // Locks the invite row, so a link shared in a big group chat can't pass its use limit.
      const [invite] = await q<{ owner: string; name: string; uses: number }>(
        `select i.owner, u.name, i.uses from invites i join users u on u.id = i.owner
          where i.code_hash = $1 and not i.revoked and i.expires_at > now()
          for update of i`,
        [sha256(code)],
      );
      if (!invite || invite.uses >= INVITE_MAX_USES) throw new HttpError(404, 'This invite has expired');
      if (invite.owner === me.id) throw new HttpError(400, 'That’s your own invite');
      const [a, b] = [me.id, invite.owner].sort();
      const added = await q('insert into friendships (a, b) values ($1, $2) on conflict do nothing returning a', [a, b]);
      if (added.length) await q('update invites set uses = uses + 1 where code_hash = $1', [sha256(code)]);
      return { friend: { id: invite.owner, name: invite.name }, alreadyFriends: added.length === 0 };
    }),
  );
});
