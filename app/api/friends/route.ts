import { requireUser } from '../../../lib/server/auth';
import { query } from '../../../lib/server/db';
import { handle, json } from '../../../lib/server/http';
import { cleanTerm, type SharedSection } from '../../../lib/server/schedule';

type Row = {
  id: string;
  name: string;
  sharing_paused: boolean;
  since: string;
  schedules: { term: string; sections: SharedSection[]; updatedAt: string }[] | null;
};

/**
 * Friends and their schedules for the requested terms (`?terms=202610,202620`), in one query. A friend who paused
 * sharing comes back without schedules.
 */
export const GET = handle(async (req: Request) => {
  const me = await requireUser(req);
  const terms = (new URL(req.url).searchParams.get('terms') ?? '').split(',').filter(Boolean).slice(0, 4).map(cleanTerm);
  const rows = await query<Row>(
    `with mine as (
       select case when a = $1 then b else a end as friend, created_at from friendships where a = $1 or b = $1
     )
     select u.id, u.name, u.sharing_paused, mine.created_at as since,
            case when u.sharing_paused then null else (
              select json_agg(json_build_object('term', s.term, 'sections', s.sections, 'updatedAt', s.updated_at))
                from schedules s where s.user_id = u.id and s.term = any($2::text[])
            ) end as schedules
       from mine join users u on u.id = mine.friend
      order by mine.created_at`,
    [me.id, terms],
  );
  return json({
    widgetsUnlocked: me.widgets_unlocked,
    friends: rows.map((r) => ({
      id: r.id,
      name: r.name,
      paused: r.sharing_paused,
      since: r.since,
      schedules: Object.fromEntries((r.schedules ?? []).map((s) => [s.term, { sections: s.sections, updatedAt: s.updatedAt }])),
    })),
  });
});
