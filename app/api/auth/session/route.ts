import { sha256 } from '../../../../lib/server/auth';
import { query } from '../../../../lib/server/db';
import { handle, noContent } from '../../../../lib/server/http';

/** Signs out: ends this device's session on the server, not just on the phone. */
export const DELETE = handle(async (req: Request) => {
  const header = req.headers.get('authorization') ?? '';
  if (header.startsWith('Bearer ')) await query('delete from sessions where token_hash = $1', [sha256(header.slice(7))]);
  return noContent();
});
