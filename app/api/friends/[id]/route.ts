import { requireUser } from '../../../../lib/server/auth';
import { query } from '../../../../lib/server/db';
import { handle, HttpError, noContent } from '../../../../lib/server/http';

type Params = { params: Promise<{ id: string }> };

/**
 * Removes a friend, silently, for both people. Also retires the remover's open invite links, so the person they
 * removed can't rejoin through a link they already have.
 */
export const DELETE = handle(async (req: Request, { params }: Params) => {
  const me = await requireUser(req);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new HttpError(404, 'Not found');
  await query('delete from friendships where (a = $1 and b = $2) or (a = $2 and b = $1)', [me.id, id]);
  await query('update invites set revoked = true where owner = $1 and not revoked', [me.id]);
  return noContent();
});
