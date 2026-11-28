import { requireUser } from '../../../../lib/server/auth';
import { query } from '../../../../lib/server/db';
import { body, handle, HttpError, noContent } from '../../../../lib/server/http';
import { cleanSections, cleanTerm } from '../../../../lib/server/schedule';

type Params = { params: Promise<{ term: string }> };

/** Saves the signed-in person's classes for a term. An unchanged hash skips the write. */
export const PUT = handle(async (req: Request, { params }: Params) => {
  const me = await requireUser(req);
  const term = cleanTerm((await params).term);
  const { sections, hash } = await body<{ sections?: unknown; hash?: unknown }>(req);
  if (typeof hash !== 'string' || hash.length > 64) throw new HttpError(400, 'Invalid hash');
  const clean = cleanSections(sections);
  if (clean.length === 0) {
    await query('delete from schedules where user_id = $1 and term = $2', [me.id, term]);
    return noContent();
  }
  await query(
    `insert into schedules (user_id, term, sections, hash) values ($1, $2, $3, $4)
     on conflict (user_id, term) do update set sections = excluded.sections, hash = excluded.hash, updated_at = now()
     where schedules.hash is distinct from excluded.hash`,
    [me.id, term, JSON.stringify(clean), hash],
  );
  return noContent();
});
