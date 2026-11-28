import { randomBytes } from 'node:crypto';

import { sha256 } from './auth';
import { one } from './db';

// Crockford base32 without look-alikes, so a code read aloud or typed still works.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const CODE_LENGTH = 12;

/** Invite links work for a week and for up to this many people, then the sender makes a new one. */
export const INVITE_DAYS = 7;
export const INVITE_MAX_USES = 25;

export const SITE_URL = process.env.SITE_URL ?? 'https://belltower.bymanu.me';

export function newCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  return Array.from(bytes, (b) => ALPHABET[b % 32]).join('');
}

export const normalizeCode = (code: string) => code.toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');

export const inviteUrl = (code: string) => `${SITE_URL}/i/${code}`;

export type LiveInvite = { owner: string; owner_name: string };

/** The invite behind a code if it's still usable. */
export async function findInvite(code: string): Promise<LiveInvite | null> {
  const clean = normalizeCode(code);
  if (clean.length !== CODE_LENGTH) return null;
  return one<LiveInvite>(
    `select i.owner, u.name as owner_name
       from invites i join users u on u.id = i.owner
      where i.code_hash = $1 and not i.revoked and i.expires_at > now() and i.uses < $2`,
    [sha256(clean), INVITE_MAX_USES],
  );
}
