import { appleRefreshToken, verifyIdentityToken } from '../../../../lib/server/apple';
import { cleanName, createSession, publicUser, WIDGETS_UNLOCKED, type User } from '../../../../lib/server/auth';
import { one, query } from '../../../../lib/server/db';
import { body, handle, HttpError, json } from '../../../../lib/server/http';

/**
 * Sign in with Apple. The app sends the identity token, the raw nonce it hashed into the request, and the name
 * Apple returned (only on a person's first sign-in). Email is never requested or stored.
 */
export const POST = handle(async (req: Request) => {
  const { identityToken, nonce, name, authorizationCode, clientId } = await body<{
    identityToken?: string;
    nonce?: string;
    name?: string;
    authorizationCode?: string;
    clientId?: string;
  }>(req);
  if (!identityToken || !nonce) throw new HttpError(400, 'Missing token');
  const sub = await verifyIdentityToken(identityToken, nonce);

  const existing = await one<User>(`select id, name, sharing_paused, ${WIDGETS_UNLOCKED} from users u where apple_sub = $1`, [sub]);
  const user =
    existing ??
    (await one<User>(
      `insert into users as u (apple_sub, name) values ($1, $2)
       on conflict (apple_sub) do update set apple_sub = excluded.apple_sub
       returning id, name, sharing_paused, ${WIDGETS_UNLOCKED}`,
      [sub, cleanName(name) ?? ''],
    ))!;
  const refresh = authorizationCode && clientId ? await appleRefreshToken(authorizationCode, clientId) : null;
  if (refresh) await query('update users set apple_refresh_token = $2 where id = $1', [user.id, refresh]);
  const token = await createSession(user.id);
  return json({ token, user: publicUser(user), isNew: !existing });
});
