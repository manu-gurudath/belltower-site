import { createHash } from 'node:crypto';
import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from 'jose';

import { HttpError } from './http';

const ISSUER = 'https://appleid.apple.com';
const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/auth/keys`));

/** The App Store app and the "Belltower Dev" build. Both sign in with the same team, so a person's `sub` matches. */
export const CLIENT_IDS = ['me.bymanu.belltower', 'me.bymanu.belltower.dev'];
const TEAM_ID = process.env.APPLE_TEAM_ID ?? '78H2VSK889';

/** Verifies a Sign in with Apple identity token and returns the user's stable `sub`. */
export async function verifyIdentityToken(identityToken: string, rawNonce: string): Promise<string> {
  try {
    const { payload } = await jwtVerify(identityToken, JWKS, { issuer: ISSUER, audience: CLIENT_IDS });
    const expected = createHash('sha256').update(rawNonce).digest('hex');
    if (!payload.sub || payload.nonce !== expected) throw new Error('nonce');
    return payload.sub;
  } catch {
    throw new HttpError(401, 'Sign in with Apple failed');
  }
}

/** Whether the server has a Sign in with Apple key, needed to revoke a deleted account's Apple sign-in. */
export const canRevoke = () => Boolean(process.env.APPLE_PRIVATE_KEY && process.env.APPLE_KEY_ID);

async function clientSecret(clientId: string): Promise<string> {
  const key = await importPKCS8(process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, '\n'), 'ES256');
  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: process.env.APPLE_KEY_ID! })
    .setIssuer(TEAM_ID)
    .setSubject(clientId)
    .setAudience(ISSUER)
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(key);
}

/**
 * Exchanges a fresh authorization code for a refresh token and revokes it, so Apple stops listing Belltower under
 * the person's Apple ID. Best effort: account deletion goes ahead even if Apple is unreachable.
 */
export async function revokeAppleSignIn(authorizationCode: string, clientId: string): Promise<boolean> {
  if (!canRevoke() || !CLIENT_IDS.includes(clientId)) return false;
  try {
    const secret = await clientSecret(clientId);
    const form = (fields: Record<string, string>) => ({
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields),
    });
    const tokenRes = await fetch(
      `${ISSUER}/auth/token`,
      form({ client_id: clientId, client_secret: secret, code: authorizationCode, grant_type: 'authorization_code' }),
    );
    if (!tokenRes.ok) return false;
    const { refresh_token } = (await tokenRes.json()) as { refresh_token?: string };
    if (!refresh_token) return false;
    const revokeRes = await fetch(
      `${ISSUER}/auth/revoke`,
      form({ client_id: clientId, client_secret: secret, token: refresh_token, token_type_hint: 'refresh_token' }),
    );
    return revokeRes.ok;
  } catch {
    return false;
  }
}
