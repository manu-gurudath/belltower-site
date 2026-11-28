import { handle, HttpError, json } from '../../../../lib/server/http';
import { findInvite } from '../../../../lib/server/invites';

type Params = { params: Promise<{ code: string }> };

/** Who sent an invite, for the preview before accepting. Only the first name leaves the server. */
export const GET = handle(async (_req: Request, { params }: Params) => {
  const invite = await findInvite((await params).code);
  if (!invite) throw new HttpError(404, 'This invite has expired');
  return json({ owner: { id: invite.owner, name: invite.owner_name.split(' ')[0] } });
});
